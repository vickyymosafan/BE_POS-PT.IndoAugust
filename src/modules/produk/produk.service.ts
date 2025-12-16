import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaPusatService } from '../../prisma';
import { CreateProdukDto, UpdateProdukDto } from './dto';

interface ProdukReplikasi {
  id: string;
  kodeProduk: string;
  namaProduk: string;
  kategori: string;
  kategoriId: string;
  hargaDasar: number;
}

/**
 * ProdukService - Mengelola master produk (Pusat)
 */
@Injectable()
export class ProdukService {
  constructor(private readonly prismaPusat: PrismaPusatService) {}

  /**
   * Ambil semua produk
   */
  async findAll() {
    return await this.prismaPusat.produk.findMany({
      include: {
        kategori: {
          select: { id: true, nama: true },
        },
        stok: {
          where: { lokasi: 'PUSAT' },
        },
      },
      orderBy: { namaProduk: 'asc' },
    });
  }

  /**
   * Ambil produk berdasarkan ID
   */
  async findOne(id: string) {
    const produk = await this.prismaPusat.produk.findUnique({
      where: { id },
      include: {
        kategori: true,
        stok: true,
      },
    });

    if (!produk) {
      throw new NotFoundException(`Produk dengan ID ${id} tidak ditemukan`);
    }

    return produk;
  }

  /**
   * Buat produk baru
   */
  async create(dto: CreateProdukDto) {
    // Cek kode produk duplikat
    const existingKode = await this.prismaPusat.produk.findUnique({
      where: { kodeProduk: dto.kodeProduk },
    });

    if (existingKode) {
      throw new ConflictException(
        `Produk dengan kode ${dto.kodeProduk} sudah ada`,
      );
    }

    // Cek kategori exists
    const kategori = await this.prismaPusat.kategori.findUnique({
      where: { id: dto.kategoriId },
    });

    if (!kategori) {
      throw new BadRequestException(
        `Kategori dengan ID ${dto.kategoriId} tidak ditemukan`,
      );
    }

    return await this.prismaPusat.produk.create({
      data: {
        kodeProduk: dto.kodeProduk,
        namaProduk: dto.namaProduk,
        kategoriId: dto.kategoriId,
        hargaDasar: dto.hargaDasar,
        isAktif: dto.isAktif ?? true,
      },
      include: {
        kategori: { select: { nama: true } },
      },
    });
  }

  /**
   * Update produk
   */
  async update(id: string, dto: UpdateProdukDto) {
    await this.findOne(id);

    // Cek kode produk duplikat jika diupdate
    if (dto.kodeProduk) {
      const existingKode = await this.prismaPusat.produk.findUnique({
        where: { kodeProduk: dto.kodeProduk },
      });

      if (existingKode && existingKode.id !== id) {
        throw new ConflictException(
          `Produk dengan kode ${dto.kodeProduk} sudah ada`,
        );
      }
    }

    return await this.prismaPusat.produk.update({
      where: { id },
      data: dto,
      include: {
        kategori: { select: { nama: true } },
      },
    });
  }

  /**
   * Aktifkan produk
   */
  async activate(id: string) {
    await this.findOne(id);

    return await this.prismaPusat.produk.update({
      where: { id },
      data: { isAktif: true },
    });
  }

  /**
   * Nonaktifkan produk
   */
  async deactivate(id: string) {
    await this.findOne(id);

    return await this.prismaPusat.produk.update({
      where: { id },
      data: { isAktif: false },
    });
  }

  /**
   * Ambil produk untuk replikasi (hanya aktif)
   * REPLIKASI PARSIAL: Hanya produk aktif dengan harga terbaru
   */
  async getProdukUntukReplikasi(): Promise<ProdukReplikasi[]> {
    const produkList = await this.prismaPusat.produk.findMany({
      where: { isAktif: true },
      include: {
        kategori: { select: { id: true, nama: true } },
      },
    });

    return produkList.map((p) => ({
      id: p.id,
      kodeProduk: p.kodeProduk,
      namaProduk: p.namaProduk,
      kategori: p.kategori.nama,
      kategoriId: p.kategori.id,
      hargaDasar: Number(p.hargaDasar),
    }));
  }
}
