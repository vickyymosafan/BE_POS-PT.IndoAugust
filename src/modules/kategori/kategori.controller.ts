import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
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
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    type: Boolean,
    description: 'Sertakan kategori non-aktif (soft deleted)',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar kategori',
    type: [KategoriResponseDto],
  })
  async findAll(@Query('includeInactive') includeInactive?: string) {
    const include = includeInactive === 'true';
    return await this.kategoriService.findAll(include);
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
  @ApiOperation({
    summary: 'Soft delete kategori',
    description: 'Menonaktifkan kategori (isAktif=false). Data tidak dihapus.',
  })
  @ApiParam({ name: 'id', description: 'UUID kategori' })
  @ApiResponse({
    status: 200,
    description: 'Kategori berhasil dinonaktifkan',
  })
  @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan' })
  @ApiResponse({ status: 409, description: 'Kategori sudah tidak aktif' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.kategoriService.delete(id);
  }

  @Patch(':id/restore')
  @ApiOperation({
    summary: 'Restore kategori',
    description: 'Mengaktifkan kembali kategori yang sudah di-soft delete',
  })
  @ApiParam({ name: 'id', description: 'UUID kategori' })
  @ApiResponse({
    status: 200,
    description: 'Kategori berhasil diaktifkan kembali',
  })
  @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan' })
  @ApiResponse({ status: 409, description: 'Kategori sudah aktif' })
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    return await this.kategoriService.restore(id);
  }
}
