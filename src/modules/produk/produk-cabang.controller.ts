import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PrismaCabangService } from '../../prisma';

/**
 * ProdukCabangController - Endpoint readonly untuk produk di cabang
 * Cabang tidak bisa mengubah produk, hanya bisa melihat
 */
@ApiTags('Cabang - Produk')
@Controller('api/cabang/produk')
export class ProdukCabangController {
  constructor(private readonly prismaCabang: PrismaCabangService) {}

  @Get()
  @ApiOperation({
    summary: 'Ambil produk tersedia (readonly)',
    description:
      'Menampilkan produk yang sudah direplikasi dari pusat beserta stok lokal',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar produk di cabang',
  })
  async findAll() {
    return await this.prismaCabang.produk.findMany({
      where: { isAktif: true },
      include: {
        kategori: {
          select: { id: true, nama: true },
        },
        stok: {
          where: { lokasi: 'CABANG_BONDOWOSO' },
        },
      },
      orderBy: { namaProduk: 'asc' },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail produk (readonly)' })
  @ApiParam({ name: 'id', description: 'UUID produk' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.prismaCabang.produk.findUnique({
      where: { id },
      include: {
        kategori: true,
        stok: {
          where: { lokasi: 'CABANG_BONDOWOSO' },
        },
      },
    });
  }
}
