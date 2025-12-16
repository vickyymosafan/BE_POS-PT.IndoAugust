import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaPusatService, PrismaCabangService } from '../../prisma';
import { LokasiStok, UpdateStokDto, KurangiStokDto } from './dto';

/**
 * StokService - Mengelola stok per lokasi
 */
@Injectable()
export class StokService {
  constructor(
    private readonly prismaPusat: PrismaPusatService,
    private readonly prismaCabang: PrismaCabangService,
  ) {}

  /**
   * Mendapatkan Prisma client berdasarkan lokasi
   */
  private getPrisma(lokasi: LokasiStok) {
    return lokasi === LokasiStok.PUSAT ? this.prismaPusat : this.prismaCabang;
  }

  /**
   * Mendapatkan lokasi database berdasarkan enum
   */
  private getLokasiDb(lokasi: LokasiStok): 'PUSAT' | 'CABANG_BONDOWOSO' {
    return lokasi === LokasiStok.PUSAT ? 'PUSAT' : 'CABANG_BONDOWOSO';
  }

  /**
   * Ambil semua stok berdasarkan lokasi
   */
  async findAllByLokasi(lokasi: LokasiStok) {
    const prisma = this.getPrisma(lokasi);
    const lokasiDb = this.getLokasiDb(lokasi);

    return await prisma.stok.findMany({
      where: { lokasi: lokasiDb },
      include: {
        produk: {
          select: {
            id: true,
            kodeProduk: true,
            namaProduk: true,
            hargaDasar: true,
          },
        },
      },
      orderBy: { produk: { namaProduk: 'asc' } },
    });
  }

  /**
   * Update stok produk
   */
  async updateStok(dto: UpdateStokDto) {
    const prisma = this.getPrisma(dto.lokasi);
    const lokasiDb = this.getLokasiDb(dto.lokasi);

    // Cek produk exist
    const produk = await prisma.produk.findUnique({
      where: { id: dto.produkId },
    });

    if (!produk) {
      throw new NotFoundException(`Produk dengan ID ${dto.produkId} tidak ditemukan`);
    }

    // Update or create stok
    return await prisma.stok.upsert({
      where: {
        produkId_lokasi: {
          produkId: dto.produkId,
          lokasi: lokasiDb,
        },
      },
      update: {
        jumlah: dto.jumlah,
        lastUpdated: new Date(),
      },
      create: {
        produkId: dto.produkId,
        lokasi: lokasiDb,
        jumlah: dto.jumlah,
      },
    });
  }

  /**
   * Kurangi stok (untuk transaksi penjualan)
   */
  async kurangiStok(dto: KurangiStokDto, lokasi: LokasiStok) {
    const prisma = this.getPrisma(lokasi);
    const lokasiDb = this.getLokasiDb(lokasi);

    // Cek stok exist dan cukup
    const stok = await prisma.stok.findUnique({
      where: {
        produkId_lokasi: {
          produkId: dto.produkId,
          lokasi: lokasiDb,
        },
      },
    });

    if (!stok) {
      throw new NotFoundException(`Stok untuk produk tidak ditemukan`);
    }

    if (stok.jumlah < dto.qty) {
      throw new BadRequestException(
        `Stok tidak cukup. Tersedia: ${stok.jumlah}, Diminta: ${dto.qty}`,
      );
    }

    return await prisma.stok.update({
      where: {
        produkId_lokasi: {
          produkId: dto.produkId,
          lokasi: lokasiDb,
        },
      },
      data: {
        jumlah: stok.jumlah - dto.qty,
        lastUpdated: new Date(),
      },
    });
  }

  /**
   * Inisialisasi stok di cabang (untuk replikasi)
   */
  async inisialisasiStokCabang(produkId: string, jumlah: number) {
    return await this.prismaCabang.stok.upsert({
      where: {
        produkId_lokasi: {
          produkId: produkId,
          lokasi: 'CABANG_BONDOWOSO',
        },
      },
      update: {
        jumlah: jumlah,
        lastUpdated: new Date(),
      },
      create: {
        produkId: produkId,
        lokasi: 'CABANG_BONDOWOSO',
        jumlah: jumlah,
      },
    });
  }
}
