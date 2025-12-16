import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StokService } from './stok.service';
import { LokasiStok, UpdateStokDto, StokResponseDto } from './dto';

/**
 * StokCabangController - Endpoint untuk stok di cabang
 */
@ApiTags('Cabang - Stok')
@Controller('api/cabang/stok')
export class StokCabangController {
  constructor(private readonly stokService: StokService) {}

  @Get()
  @ApiOperation({ summary: 'Lihat semua stok di cabang' })
  @ApiResponse({ status: 200, description: 'Daftar stok', type: [StokResponseDto] })
  async findAll() {
    return await this.stokService.findAllByLokasi(LokasiStok.CABANG_BONDOWOSO);
  }

  @Put()
  @ApiOperation({ summary: 'Update stok di cabang' })
  @ApiResponse({ status: 200, description: 'Stok berhasil diupdate' })
  async update(@Body() dto: UpdateStokDto) {
    dto.lokasi = LokasiStok.CABANG_BONDOWOSO;
    return await this.stokService.updateStok(dto);
  }
}

/**
 * StokPusatController - Endpoint untuk stok di pusat
 */
@ApiTags('Pusat - Stok')
@Controller('api/pusat/stok')
export class StokPusatController {
  constructor(private readonly stokService: StokService) {}

  @Get()
  @ApiOperation({ summary: 'Lihat semua stok di pusat' })
  @ApiResponse({ status: 200, description: 'Daftar stok', type: [StokResponseDto] })
  async findAll() {
    return await this.stokService.findAllByLokasi(LokasiStok.PUSAT);
  }

  @Put()
  @ApiOperation({ summary: 'Update stok di pusat' })
  @ApiResponse({ status: 200, description: 'Stok berhasil diupdate' })
  async update(@Body() dto: UpdateStokDto) {
    dto.lokasi = LokasiStok.PUSAT;
    return await this.stokService.updateStok(dto);
  }
}
