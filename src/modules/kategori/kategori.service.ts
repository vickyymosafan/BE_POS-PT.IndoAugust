import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaPusatService } from '../../prisma';
import { CreateKategoriDto, UpdateKategoriDto } from './dto';

/**
 * KategoriService - Mengelola master kategori produk
 */
@Injectable()
export class KategoriService {
  constructor(private readonly prismaPusat: PrismaPusatService) {}

  /**
   * Ambil semua kategori
   */
  async findAll() {
    return await this.prismaPusat.kategori.findMany({
      orderBy: { nama: 'asc' },
    });
  }

  /**
   * Ambil kategori berdasarkan ID
   */
  async findOne(id: string) {
    const kategori = await this.prismaPusat.kategori.findUnique({
      where: { id },
      include: {
        produk: {
          select: { id: true, kodeProduk: true, namaProduk: true },
        },
      },
    });

    if (!kategori) {
      throw new NotFoundException(`Kategori dengan ID ${id} tidak ditemukan`);
    }

    return kategori;
  }

  /**
   * Buat kategori baru
   */
  async create(dto: CreateKategoriDto) {
    // Cek nama sudah ada
    const existing = await this.prismaPusat.kategori.findUnique({
      where: { nama: dto.nama },
    });

    if (existing) {
      throw new ConflictException(`Kategori dengan nama ${dto.nama} sudah ada`);
    }

    return await this.prismaPusat.kategori.create({
      data: {
        nama: dto.nama,
        deskripsi: dto.deskripsi,
      },
    });
  }

  /**
   * Update kategori
   */
  async update(id: string, dto: UpdateKategoriDto) {
    await this.findOne(id);

    // Cek nama duplikat (jika nama diupdate)
    if (dto.nama) {
      const existing = await this.prismaPusat.kategori.findFirst({
        where: {
          nama: dto.nama,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException(
          `Kategori dengan nama ${dto.nama} sudah ada`,
        );
      }
    }

    return await this.prismaPusat.kategori.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Hapus kategori
   */
  async delete(id: string) {
    await this.findOne(id);

    // Cek apakah ada produk terkait
    const produkCount = await this.prismaPusat.produk.count({
      where: { kategoriId: id },
    });

    if (produkCount > 0) {
      throw new ConflictException(
        `Tidak dapat menghapus kategori karena masih memiliki ${produkCount} produk`,
      );
    }

    return await this.prismaPusat.kategori.delete({
      where: { id },
    });
  }
}
