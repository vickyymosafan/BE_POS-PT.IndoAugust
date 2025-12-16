import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TransaksiService } from './transaksi.service';
import { CreateTransaksiDto, TransaksiResponseDto } from './dto';

/**
 * TransaksiCabangController - Endpoint untuk transaksi di cabang
 */
@ApiTags('Cabang - Transaksi')
@Controller('api/cabang/transaksi')
export class TransaksiCabangController {
  constructor(private readonly transaksiService: TransaksiService) {}

  @Post()
  @ApiOperation({
    summary: 'Buat transaksi baru',
    description: 'Membuat transaksi penjualan baru. Status awal PENDING.',
  })
  @ApiResponse({ status: 201, description: 'Transaksi berhasil dibuat' })
  async create(@Body() dto: CreateTransaksiDto) {
    return await this.transaksiService.createTransaksiCabang(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lihat semua transaksi cabang' })
  @ApiResponse({ status: 200, type: [TransaksiResponseDto] })
  async findAll() {
    return await this.transaksiService.findAllCabang();
  }

  @Get('pending')
  @ApiOperation({ summary: 'Lihat transaksi yang belum dikirim ke pusat' })
  @ApiResponse({ status: 200, type: [TransaksiResponseDto] })
  async getPending() {
    return await this.transaksiService.getTransaksiPending();
  }
}

/**
 * TransaksiPusatController - Endpoint untuk transaksi di pusat
 */
@ApiTags('Pusat - Transaksi')
@Controller('api/pusat/transaksi')
export class TransaksiPusatController {
  constructor(private readonly transaksiService: TransaksiService) {}

  @Get()
  @ApiOperation({
    summary: 'Lihat semua transaksi dari cabang',
    description: 'Menampilkan transaksi yang sudah diterima dari cabang',
  })
  @ApiQuery({
    name: 'cabang',
    required: false,
    description: 'Filter berdasarkan cabang',
  })
  @ApiResponse({ status: 200, type: [TransaksiResponseDto] })
  async findAll(@Query('cabang') cabang?: string) {
    // TODO: implement filter by cabang if needed
    void cabang;
    return await this.transaksiService.findAllPusat();
  }

  @Get('laporan')
  @ApiOperation({ summary: 'Laporan penjualan per cabang' })
  @ApiResponse({
    status: 200,
    description: 'Laporan penjualan agregat per cabang',
  })
  async getLaporan() {
    return await this.transaksiService.getLaporanPenjualan();
  }
}
