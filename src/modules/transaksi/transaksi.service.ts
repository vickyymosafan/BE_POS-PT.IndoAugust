import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaPusatService, PrismaCabangService } from '../../prisma';
import { CreateTransaksiDto, TerimaTransaksiDto, StatusSync } from './dto';
import { StokService } from '../stok/stok.service';
import { LokasiStok } from '../stok/dto';
import { v4 as uuidv4 } from 'uuid';

/**
 * TransaksiService - Mengelola transaksi penjualan
 */
@Injectable()
export class TransaksiService {
  constructor(
    private readonly prismaPusat: PrismaPusatService,
    private readonly prismaCabang: PrismaCabangService,
    private readonly stokService: StokService,
  ) {}

  /**
   * Generate nomor transaksi
   */
  private generateNomorTransaksi(): string {
    const now = new Date();
    const dateStr = now
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '');
    const timeStr = now.getTime().toString().slice(-6);
    return `TRX-BDWS-${dateStr}-${timeStr}`;
  }

  /**
   * Membuat transaksi baru di Cabang
   * Status awal: PENDING (akan dikirim ke pusat via sinkronisasi)
   */
  async createTransaksiCabang(dto: CreateTransaksiDto) {
    // Validate items and calculate total
    let totalHarga = 0;
    const itemsData: Array<{
      produkId: string;
      qty: number;
      hargaJual: number;
    }> = [];

    for (const item of dto.items) {
      // Cek produk exist di cabang
      const produk = await this.prismaCabang.produk.findUnique({
        where: { id: item.produkId },
      });

      if (!produk) {
        throw new NotFoundException(`Produk dengan ID ${item.produkId} tidak ditemukan`);
      }

      if (!produk.isAktif) {
        throw new BadRequestException(
          `Produk ${produk.namaProduk} tidak aktif`,
        );
      }

      // Kurangi stok lokal
      await this.stokService.kurangiStok(
        { produkId: item.produkId, qty: item.qty },
        LokasiStok.CABANG_BONDOWOSO,
      );

      totalHarga += item.hargaJual * item.qty;
      itemsData.push({
        produkId: item.produkId,
        qty: item.qty,
        hargaJual: item.hargaJual,
      });
    }

    // Create transaksi
    const transaksi = await this.prismaCabang.transaksi.create({
      data: {
        nomorTransaksi: this.generateNomorTransaksi(),
        lokasiCabang: 'CABANG_BONDOWOSO',
        tanggal: new Date(),
        totalHarga: totalHarga,
        statusSync: 'PENDING',
        requestId: uuidv4(),
        detailTransaksi: {
          create: itemsData.map((item) => ({
            produkId: item.produkId,
            qty: item.qty,
            hargaJual: item.hargaJual,
          })),
        },
      },
      include: {
        detailTransaksi: true,
      },
    });

    return transaksi;
  }

  /**
   * Ambil semua transaksi di cabang
   */
  async findAllCabang() {
    return await this.prismaCabang.transaksi.findMany({
      include: {
        detailTransaksi: {
          include: {
            produk: {
              select: { namaProduk: true, kodeProduk: true },
            },
          },
        },
      },
      orderBy: { tanggal: 'desc' },
    });
  }

  /**
   * Ambil transaksi pending di cabang
   */
  async getTransaksiPending() {
    return await this.prismaCabang.transaksi.findMany({
      where: { statusSync: 'PENDING' },
      include: { detailTransaksi: true },
      orderBy: { tanggal: 'asc' },
    });
  }

  /**
   * Terima transaksi dari cabang (di Pusat)
   * Menggunakan requestId untuk idempotency
   */
  async terimaTransaksiDariCabang(dto: TerimaTransaksiDto) {
    // Check idempotency - apakah transaksi sudah ada
    const existing = await this.prismaPusat.transaksi.findUnique({
      where: { requestId: dto.requestId },
    });

    if (existing) {
      // Sudah pernah diterima, return yang sudah ada (idempotent)
      return { isNew: false, transaksi: existing };
    }

    // Simpan transaksi baru di pusat
    const transaksi = await this.prismaPusat.transaksi.create({
      data: {
        nomorTransaksi: dto.nomorTransaksi,
        lokasiCabang: dto.lokasiCabang,
        tanggal: dto.tanggal,
        totalHarga: dto.totalHarga,
        statusSync: 'SYNCED',
        requestId: dto.requestId,
        detailTransaksi: {
          create: dto.items.map((item) => ({
            produkId: item.produkId,
            qty: item.qty,
            hargaJual: item.hargaJual,
          })),
        },
      },
      include: {
        detailTransaksi: true,
      },
    });

    return { isNew: true, transaksi };
  }

  /**
   * Ambil semua transaksi di pusat
   */
  async findAllPusat() {
    return await this.prismaPusat.transaksi.findMany({
      include: {
        detailTransaksi: {
          include: {
            produk: {
              select: { namaProduk: true, kodeProduk: true },
            },
          },
        },
      },
      orderBy: { tanggal: 'desc' },
    });
  }

  /**
   * Update status sync transaksi di cabang
   */
  async updateStatusSync(transaksiId: string, status: StatusSync) {
    const statusDb = status as 'PENDING' | 'SYNCED' | 'FAILED';

    return await this.prismaCabang.transaksi.update({
      where: { id: transaksiId },
      data: { statusSync: statusDb },
    });
  }

  /**
   * Laporan penjualan per cabang (di Pusat)
   */
  async getLaporanPenjualan() {
    const result = await this.prismaPusat.transaksi.groupBy({
      by: ['lokasiCabang'],
      _count: { id: true },
      _sum: { totalHarga: true },
    });

    return result.map((t) => ({
      lokasiCabang: t.lokasiCabang,
      totalTransaksi: t._count.id,
      totalPenjualan: t._sum.totalHarga,
    }));
  }
}
