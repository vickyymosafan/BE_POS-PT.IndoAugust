import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Enum status sync untuk DTO
 */
export enum StatusSync {
  PENDING = 'PENDING',
  SYNCED = 'SYNCED',
  FAILED = 'FAILED',
}

/**
 * DTO untuk item transaksi
 */
export class ItemTransaksiDto {
  @ApiProperty({ description: 'ID produk' })
  @IsNotEmpty()
  @IsUUID()
  produkId: string;

  @ApiProperty({ description: 'Jumlah item', example: 2 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  qty: number;

  @ApiProperty({ description: 'Harga jual per item', example: 15000 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  hargaJual: number;
}

/**
 * DTO untuk membuat transaksi baru
 */
export class CreateTransaksiDto {
  @ApiProperty({
    description: 'Detail item transaksi',
    type: [ItemTransaksiDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemTransaksiDto)
  items: ItemTransaksiDto[];
}

/**
 * DTO untuk menerima transaksi dari cabang (di Pusat)
 */
export class TerimaTransaksiDto {
  @ApiProperty({ description: 'Nomor transaksi dari cabang' })
  @IsNotEmpty()
  nomorTransaksi: string;

  @ApiProperty({ description: 'Lokasi cabang' })
  @IsNotEmpty()
  lokasiCabang: string;

  @ApiProperty({ description: 'Tanggal transaksi' })
  @IsNotEmpty()
  tanggal: Date;

  @ApiProperty({ description: 'Total harga' })
  @IsNumber()
  totalHarga: number;

  @ApiProperty({ description: 'Request ID untuk idempotency' })
  @IsNotEmpty()
  requestId: string;

  @ApiProperty({ description: 'Detail transaksi', type: [ItemTransaksiDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemTransaksiDto)
  items: ItemTransaksiDto[];
}

/**
 * DTO response transaksi
 */
export class TransaksiResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nomorTransaksi: string;

  @ApiProperty()
  lokasiCabang: string;

  @ApiProperty()
  tanggal: Date;

  @ApiProperty()
  totalHarga: number;

  @ApiProperty({ enum: StatusSync })
  statusSync: StatusSync;

  @ApiProperty()
  requestId: string;
}
