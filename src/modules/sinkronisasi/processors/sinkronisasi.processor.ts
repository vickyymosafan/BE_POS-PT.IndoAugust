import {
  Processor,
  Process,
  OnQueueFailed,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { PrismaPusatService, PrismaCabangService } from '../../../prisma';
import { RealtimeGateway } from '../../realtime/realtime.gateway';

export const SINKRONISASI_QUEUE = 'sinkronisasi-queue';

export interface SyncProdukJob {
  triggeredAt: Date;
  triggeredBy?: string;
}

export interface SyncTransaksiJob {
  triggeredAt: Date;
  triggeredBy?: string;
}

/**
 * SinkronisasiProcessor - Bull Queue processor untuk async replication
 * Menangani background jobs untuk sinkronisasi data
 */
@Processor(SINKRONISASI_QUEUE)
export class SinkronisasiProcessor {
  private readonly logger = new Logger(SinkronisasiProcessor.name);

  constructor(
    private readonly prismaPusat: PrismaPusatService,
    private readonly prismaCabang: PrismaCabangService,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  /**
   * Process sync produk dari pusat ke cabang (Replikasi Parsial)
   */
  @Process('sync-produk-ke-cabang')
  async handleSyncProdukKeCabang(job: Job<SyncProdukJob>) {
    this.logger.log(`Processing job ${job.id}: sync-produk-ke-cabang`);

    try {
      // Get produk aktif dari pusat
      const produkList = await this.prismaPusat.produk.findMany({
        where: { isAktif: true },
        include: { kategori: { select: { id: true, nama: true } } },
      });

      let successCount = 0;
      let failCount = 0;
      const errors: string[] = [];

      for (const produk of produkList) {
        try {
          // Upsert kategori
          const kategori = await this.prismaCabang.kategori.upsert({
            where: { nama: produk.kategori.nama },
            update: {},
            create: {
              id: produk.kategori.id,
              nama: produk.kategori.nama,
            },
          });

          // Upsert produk
          await this.prismaCabang.produk.upsert({
            where: { kodeProduk: produk.kodeProduk },
            update: {
              namaProduk: produk.namaProduk,
              kategoriId: kategori.id,
              hargaDasar: produk.hargaDasar,
              isAktif: true,
            },
            create: {
              id: produk.id,
              kodeProduk: produk.kodeProduk,
              namaProduk: produk.namaProduk,
              kategoriId: kategori.id,
              hargaDasar: produk.hargaDasar,
              isAktif: true,
            },
          });

          // Init stok if not exist
          await this.prismaCabang.stok.upsert({
            where: {
              produkId_lokasi: {
                produkId: produk.id,
                lokasi: 'CABANG_BONDOWOSO',
              },
            },
            update: {},
            create: {
              produkId: produk.id,
              lokasi: 'CABANG_BONDOWOSO',
              jumlah: 50,
            },
          });

          successCount++;
        } catch (error) {
          failCount++;
          errors.push(`Produk ${produk.id}: ${(error as Error).message}`);
        }
      }

      // Emit WebSocket notification
      this.realtimeGateway.emitProdukUpdate({
        action: 'sync',
        count: successCount,
      });

      // Log to database
      await this.prismaPusat.logSinkronisasi.create({
        data: {
          tipeData: 'PRODUK',
          arahReplikasi: 'PUSAT_KE_CABANG',
          status: failCount === 0 ? 'SYNCED' : 'FAILED',
          errorMessage: errors.length > 0 ? errors.join('; ') : undefined,
        },
      });

      this.logger.log(
        `Job ${job.id} completed: ${successCount} success, ${failCount} failed`,
      );

      return { success: successCount, failed: failCount, errors };
    } catch (error) {
      this.logger.error(`Job ${job.id} failed: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Process sync transaksi dari cabang ke pusat (Replikasi Penuh)
   */
  @Process('sync-transaksi-ke-pusat')
  async handleSyncTransaksiKePusat(job: Job<SyncTransaksiJob>) {
    this.logger.log(`Processing job ${job.id}: sync-transaksi-ke-pusat`);

    try {
      // Get pending transactions
      const pendingList = await this.prismaCabang.transaksi.findMany({
        where: { statusSync: 'PENDING' },
        include: { detailTransaksi: true },
        orderBy: { tanggal: 'asc' },
      });

      let successCount = 0;
      let failCount = 0;
      const errors: string[] = [];

      for (const trx of pendingList) {
        try {
          // Check idempotency
          const existing = await this.prismaPusat.transaksi.findUnique({
            where: { requestId: trx.requestId },
          });

          if (!existing) {
            // Create transaction at pusat
            const created = await this.prismaPusat.transaksi.create({
              data: {
                nomorTransaksi: trx.nomorTransaksi,
                lokasiCabang: trx.lokasiCabang,
                tanggal: trx.tanggal,
                totalHarga: trx.totalHarga,
                statusSync: 'SYNCED',
                requestId: trx.requestId,
                detailTransaksi: {
                  create: trx.detailTransaksi.map((d) => ({
                    produkId: d.produkId,
                    qty: d.qty,
                    hargaJual: d.hargaJual,
                  })),
                },
              },
            });

            // Emit WebSocket notification
            this.realtimeGateway.emitTransaksiBaru({
              id: created.id,
              nomorTransaksi: created.nomorTransaksi,
              lokasiCabang: created.lokasiCabang,
              totalHarga: created.totalHarga,
              tanggal: created.tanggal,
            });
          }

          // Update status at cabang
          await this.prismaCabang.transaksi.update({
            where: { id: trx.id },
            data: { statusSync: 'SYNCED' },
          });

          successCount++;
        } catch (error) {
          failCount++;
          errors.push(`Transaksi ${trx.id}: ${(error as Error).message}`);

          // Log retry
          await this.prismaCabang.logSinkronisasi.create({
            data: {
              tipeData: 'TRANSAKSI',
              arahReplikasi: 'CABANG_KE_PUSAT',
              status: 'FAILED',
              referenceId: trx.id,
              errorMessage: (error as Error).message,
            },
          });
        }
      }

      // Log final result
      await this.prismaCabang.logSinkronisasi.create({
        data: {
          tipeData: 'TRANSAKSI',
          arahReplikasi: 'CABANG_KE_PUSAT',
          status: failCount === 0 ? 'SYNCED' : 'FAILED',
          errorMessage: errors.length > 0 ? errors.join('; ') : undefined,
        },
      });

      this.logger.log(
        `Job ${job.id} completed: ${successCount} success, ${failCount} failed`,
      );

      return { success: successCount, failed: failCount, errors };
    } catch (error) {
      this.logger.error(`Job ${job.id} failed: ${(error as Error).message}`);
      throw error;
    }
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} (${job.name}) completed successfully`);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `Job ${job.id} (${job.name}) failed: ${error.message}`,
      error.stack,
    );
  }
}
