import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { KategoriService } from './kategori.service';
import {
  CreateKategoriDto,
  UpdateKategoriDto,
  KategoriResponseDto,
} from './dto';

/**
 * KategoriController - Endpoint untuk master kategori (Pusat only)
 */
@ApiTags('Pusat - Kategori')
@Controller('api/pusat/kategori')
export class KategoriController {
  constructor(private readonly kategoriService: KategoriService) {}

  @Get()
  @ApiOperation({ summary: 'Ambil semua kategori' })
  @ApiResponse({
    status: 200,
    description: 'Daftar kategori',
    type: [KategoriResponseDto],
  })
  async findAll() {
    return await this.kategoriService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil kategori berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'UUID kategori' })
  @ApiResponse({ status: 200, description: 'Detail kategori' })
  @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.kategoriService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Buat kategori baru' })
  @ApiResponse({ status: 201, description: 'Kategori berhasil dibuat' })
  @ApiResponse({ status: 409, description: 'Nama kategori sudah ada' })
  async create(@Body() dto: CreateKategoriDto) {
    return await this.kategoriService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update kategori' })
  @ApiParam({ name: 'id', description: 'UUID kategori' })
  @ApiResponse({ status: 200, description: 'Kategori berhasil diupdate' })
  @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateKategoriDto,
  ) {
    return await this.kategoriService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus kategori' })
  @ApiParam({ name: 'id', description: 'UUID kategori' })
  @ApiResponse({ status: 200, description: 'Kategori berhasil dihapus' })
  @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan' })
  @ApiResponse({ status: 409, description: 'Kategori masih memiliki produk' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.kategoriService.delete(id);
  }
}
