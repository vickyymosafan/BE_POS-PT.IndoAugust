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
   * Ambil semua kategori aktif
   */
  async findAll(includeInactive: boolean = false) {
    const where = includeInactive ? {} : { isAktif: true };
    return await this.prismaPusat.kategori.findMany({
      where,
      include: {
        produk: {
          select: { id: true },
        },
      },
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
   * Soft delete kategori (set isAktif = false)
   * Kategori tetap ada di database, tapi tidak aktif
   */
  async delete(id: string) {
    const kategori = await this.findOne(id);

    if (!kategori.isAktif) {
      throw new ConflictException(`Kategori sudah tidak aktif`);
    }

    return await this.prismaPusat.kategori.update({
      where: { id },
      data: { isAktif: false },
    });
  }

  /**
   * Restore kategori yang sudah di-soft delete
   */
  async restore(id: string) {
    const kategori = await this.findOne(id);

    if (kategori.isAktif) {
      throw new ConflictException(`Kategori sudah aktif`);
    }

    return await this.prismaPusat.kategori.update({
      where: { id },
      data: { isAktif: true },
    });
  }
}
