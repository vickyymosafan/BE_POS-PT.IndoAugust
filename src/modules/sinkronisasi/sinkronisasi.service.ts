import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { PrismaPusatService, PrismaCabangService } from '../../prisma';
import { ProdukService } from '../produk/produk.service';
import { TransaksiService } from '../transaksi/transaksi.service';
import { StatusSync } from '../transaksi/dto';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { TipeDataSync, ArahReplikasiDto, StatusSyncDto } from './dto';
import { SINKRONISASI_QUEUE } from './processors/sinkronisasi.processor';

/**
 * SinkronisasiService - Mengimplementasikan 4 sistem replikasi
 */
@Injectable()
export class SinkronisasiService {
  constructor(
    private readonly prismaPusat: PrismaPusatService,
    private readonly prismaCabang: PrismaCabangService,
    private readonly produkService: ProdukService,
    private readonly transaksiService: TransaksiService,
    private readonly realtimeGateway: RealtimeGateway,
    @InjectQueue(SINKRONISASI_QUEUE)
    private readonly sinkronisasiQueue: Queue,
  ) {}

  /**
   * REPLIKASI SATU ARAH + PARSIAL: Kirim produk dari Pusat ke Cabang
   * - Satu arah: hanya pusat -> cabang
   * - Parsial: hanya produk aktif dan harga terbaru
   */
  async kirimProdukKeCabang() {
    const produkList = await this.produkService.getProdukUntukReplikasi();

    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    for (const produk of produkList) {
      try {
        // Cek/buat kategori di cabang
        const kategoriExist = await this.prismaCabang.kategori.findFirst({
          where: { nama: produk.kategori },
        });

        const kategoriId = kategoriExist
          ? kategoriExist.id
          : (
              await this.prismaCabang.kategori.upsert({
                where: { nama: produk.kategori },
                update: {},
                create: {
                  id: produk.kategoriId,
                  nama: produk.kategori,
                },
              })
            ).id;

        // Upsert produk di cabang
        await this.prismaCabang.produk.upsert({
          where: { kodeProduk: produk.kodeProduk },
          update: {
            namaProduk: produk.namaProduk,
            kategoriId: kategoriId,
            hargaDasar: produk.hargaDasar,
            isAktif: true,
          },
          create: {
            id: produk.id,
            kodeProduk: produk.kodeProduk,
            namaProduk: produk.namaProduk,
            kategoriId: kategoriId,
            hargaDasar: produk.hargaDasar,
            isAktif: true,
          },
        });

        // Inisialisasi stok jika belum ada
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
            jumlah: 50, // Stok awal default
          },
        });

        successCount++;
      } catch (error) {
        failCount++;
        const err = error as Error;
        errors.push(`Gagal replikasi produk ${produk.id}: ${err.message}`);
      }
    }

    // Create log
    const status =
      failCount === 0 ? StatusSyncDto.SYNCED : StatusSyncDto.FAILED;

    await this.createLogSync({
      tipeData: TipeDataSync.PRODUK,
      arahReplikasi: ArahReplikasiDto.PUSAT_KE_CABANG,
      status: status,
      errorMessage: errors.length > 0 ? errors.join('; ') : undefined,
    });

    // Notify via WebSocket
    this.realtimeGateway.emitProdukUpdate({
      action: 'sync',
      count: successCount,
    });

    return {
      success: successCount,
      failed: failCount,
      total: produkList.length,
      errors,
    };
  }

  /**
   * REPLIKASI ASINKRON + PENUH: Kirim transaksi dari Cabang ke Pusat
   * - Asinkron: tidak blocking, dengan retry
   * - Penuh: semua transaksi dikirim
   */
  async kirimTransaksiKePusat() {
    const pendingList = await this.transaksiService.getTransaksiPending();

    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    for (const trx of pendingList) {
      try {
        // Prepare data untuk dikirim
        const dto = {
          nomorTransaksi: trx.nomorTransaksi,
          lokasiCabang: trx.lokasiCabang,
          tanggal: trx.tanggal,
          totalHarga: Number(trx.totalHarga),
          requestId: trx.requestId,
          items: trx.detailTransaksi.map((d) => ({
            produkId: d.produkId,
            qty: d.qty,
            hargaJual: Number(d.hargaJual),
          })),
        };

        // Kirim ke pusat
        const result =
          await this.transaksiService.terimaTransaksiDariCabang(dto);

        // Update status di cabang
        await this.transaksiService.updateStatusSync(trx.id, StatusSync.SYNCED);

        if (result.isNew) {
          // Notify via WebSocket
          this.realtimeGateway.emitTransaksiBaru(result.transaksi);
        }

        successCount++;
      } catch (error) {
        failCount++;
        const err = error as Error;
        errors.push(`Gagal kirim transaksi ${trx.id}: ${err.message}`);

        // Increment retry count
        await this.incrementRetryCount(trx.id);
      }
    }

    // Create log
    const status =
      failCount === 0 ? StatusSyncDto.SYNCED : StatusSyncDto.FAILED;

    await this.createLogSync({
      tipeData: TipeDataSync.TRANSAKSI,
      arahReplikasi: ArahReplikasiDto.CABANG_KE_PUSAT,
      status: status,
      errorMessage: errors.length > 0 ? errors.join('; ') : undefined,
    });

    return {
      success: successCount,
      failed: failCount,
      total: pendingList.length,
      errors,
    };
  }

  /**
   * Ambil status sinkronisasi untuk display
   */
  async getStatusSinkronisasi() {
    const [pendingCount, syncedCount, failedCount] = await Promise.all([
      this.prismaCabang.transaksi.count({
        where: { statusSync: 'PENDING' },
      }),
      this.prismaCabang.transaksi.count({
        where: { statusSync: 'SYNCED' },
      }),
      this.prismaCabang.transaksi.count({
        where: { statusSync: 'FAILED' },
      }),
    ]);

    const lastSync = await this.prismaCabang.logSinkronisasi.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    return {
      pendingCount,
      syncedCount,
      failedCount,
      lastSyncAt: lastSync?.lastAttempt || null,
    };
  }

  /**
   * Ambil log sinkronisasi
   */
  async getLogSinkronisasi(limit: number = 20) {
    return await this.prismaCabang.logSinkronisasi.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Buat log sinkronisasi
   */
  private async createLogSync(data: {
    tipeData: TipeDataSync;
    arahReplikasi: ArahReplikasiDto;
    status: StatusSyncDto;
    errorMessage?: string;
    referenceId?: string;
  }) {
    const prisma =
      data.arahReplikasi === ArahReplikasiDto.PUSAT_KE_CABANG
        ? this.prismaPusat
        : this.prismaCabang;

    return await prisma.logSinkronisasi.create({
      data: {
        tipeData: data.tipeData,
        arahReplikasi: data.arahReplikasi,
        status: data.status,
        errorMessage: data.errorMessage,
        referenceId: data.referenceId,
      },
    });
  }

  /**
   * Increment retry count untuk transaksi yang gagal
   */
  private async incrementRetryCount(transaksiId: string) {
    const log = await this.prismaCabang.logSinkronisasi.findFirst({
      where: {
        referenceId: transaksiId,
        tipeData: 'TRANSAKSI',
      },
      orderBy: { createdAt: 'desc' },
    });

    if (log) {
      await this.prismaCabang.logSinkronisasi.update({
        where: { id: log.id },
        data: {
          retryCount: log.retryCount + 1,
          lastAttempt: new Date(),
        },
      });
    } else {
      await this.prismaCabang.logSinkronisasi.create({
        data: {
          tipeData: 'TRANSAKSI',
          arahReplikasi: 'CABANG_KE_PUSAT',
          status: 'FAILED',
          retryCount: 1,
          referenceId: transaksiId,
        },
      });
    }
  }

  /**
   * ASYNC: Tambahkan job ke queue untuk replikasi produk
   * Background processing dengan Bull Queue
   */
  async queueKirimProdukKeCabang() {
    const job = await this.sinkronisasiQueue.add('sync-produk-ke-cabang', {
      triggeredAt: new Date(),
    });

    return {
      message: 'Job ditambahkan ke queue',
      jobId: job.id,
      queueName: 'sync-produk-ke-cabang',
    };
  }

  /**
   * ASYNC: Tambahkan job ke queue untuk replikasi transaksi
   * Background processing dengan Bull Queue
   */
  async queueKirimTransaksiKePusat() {
    const job = await this.sinkronisasiQueue.add('sync-transaksi-ke-pusat', {
      triggeredAt: new Date(),
    });

    return {
      message: 'Job ditambahkan ke queue',
      jobId: job.id,
      queueName: 'sync-transaksi-ke-pusat',
    };
  }
}
