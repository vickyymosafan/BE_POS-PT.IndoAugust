import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProdukService } from './produk.service';
import { CreateProdukDto, UpdateProdukDto, ProdukResponseDto } from './dto';

/**
 * ProdukController - Endpoint untuk master produk (Pusat only)
 */
@ApiTags('Pusat - Produk')
@Controller('api/pusat/produk')
export class ProdukController {
  constructor(private readonly produkService: ProdukService) {}

  @Get()
  @ApiOperation({ summary: 'Ambil semua produk' })
  @ApiResponse({
    status: 200,
    description: 'Daftar produk',
    type: [ProdukResponseDto],
  })
  async findAll() {
    return await this.produkService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil produk berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'UUID produk' })
  @ApiResponse({ status: 200, description: 'Detail produk' })
  @ApiResponse({ status: 404, description: 'Produk tidak ditemukan' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.produkService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Buat produk baru' })
  @ApiResponse({ status: 201, description: 'Produk berhasil dibuat' })
  @ApiResponse({ status: 409, description: 'Kode produk sudah ada' })
  async create(@Body() dto: CreateProdukDto) {
    return await this.produkService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update produk' })
  @ApiParam({ name: 'id', description: 'UUID produk' })
  @ApiResponse({ status: 200, description: 'Produk berhasil diupdate' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProdukDto,
  ) {
    return await this.produkService.update(id, dto);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Aktifkan produk' })
  @ApiParam({ name: 'id', description: 'UUID produk' })
  async activate(@Param('id', ParseUUIDPipe) id: string) {
    return await this.produkService.activate(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Nonaktifkan produk' })
  @ApiParam({ name: 'id', description: 'UUID produk' })
  async deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return await this.produkService.deactivate(id);
  }
}
