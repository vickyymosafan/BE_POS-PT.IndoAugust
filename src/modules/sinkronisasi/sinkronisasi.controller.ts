import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SinkronisasiService } from './sinkronisasi.service';
import { StatusSinkronisasiDto, LogSinkronisasiDto } from './dto';

/**
 * SinkronisasiPusatController - Endpoint untuk sinkronisasi dari Pusat
 */
@ApiTags('Pusat - Sinkronisasi')
@Controller('api/pusat/sync')
export class SinkronisasiPusatController {
  constructor(private readonly sinkronisasiService: SinkronisasiService) {}

  @Post('kirim-ke-cabang')
  @ApiOperation({
    summary: 'Kirim produk ke cabang',
    description:
      'Replikasi satu arah (parsial) - Mengirim produk aktif dari pusat ke cabang',
  })
  @ApiResponse({
    status: 200,
    description: 'Hasil sinkronisasi',
  })
  async kirimKeCabang() {
    return await this.sinkronisasiService.kirimProdukKeCabang();
  }

  @Get('log')
  @ApiOperation({ summary: 'Lihat log sinkronisasi' })
  @ApiResponse({
    status: 200,
    description: 'Daftar log sinkronisasi',
    type: [LogSinkronisasiDto],
  })
  async getLog() {
    return await this.sinkronisasiService.getLogSinkronisasi();
  }
}

/**
 * SinkronisasiCabangController - Endpoint untuk sinkronisasi dari Cabang
 */
@ApiTags('Cabang - Sinkronisasi')
@Controller('api/cabang/sync')
export class SinkronisasiCabangController {
  constructor(private readonly sinkronisasiService: SinkronisasiService) {}

  @Get('status')
  @ApiOperation({
    summary: 'Lihat status sinkronisasi',
    description: 'Menampilkan jumlah transaksi pending, synced, dan failed',
  })
  @ApiResponse({
    status: 200,
    description: 'Status sinkronisasi',
    type: StatusSinkronisasiDto,
  })
  async getStatus() {
    return await this.sinkronisasiService.getStatusSinkronisasi();
  }

  @Post('kirim-ke-pusat')
  @ApiOperation({
    summary: 'Kirim transaksi ke pusat',
    description:
      'Replikasi asinkron (penuh) - Mengirim semua transaksi pending ke pusat',
  })
  @ApiResponse({
    status: 200,
    description: 'Hasil sinkronisasi',
  })
  async kirimKePusat() {
    return await this.sinkronisasiService.kirimTransaksiKePusat();
  }

  @Get('log')
  @ApiOperation({ summary: 'Lihat log sinkronisasi' })
  @ApiResponse({
    status: 200,
    description: 'Daftar log',
    type: [LogSinkronisasiDto],
  })
  async getLog() {
    return await this.sinkronisasiService.getLogSinkronisasi();
  }
}
