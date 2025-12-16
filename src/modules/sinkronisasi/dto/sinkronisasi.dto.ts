import { IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Enum untuk tipe data sinkronisasi
 */
export enum TipeDataSync {
  PRODUK = 'PRODUK',
  TRANSAKSI = 'TRANSAKSI',
}

/**
 * Enum untuk arah replikasi
 */
export enum ArahReplikasiDto {
  PUSAT_KE_CABANG = 'PUSAT_KE_CABANG',
  CABANG_KE_PUSAT = 'CABANG_KE_PUSAT',
}

/**
 * Enum untuk status sinkronisasi
 */
export enum StatusSyncDto {
  PENDING = 'PENDING',
  SYNCED = 'SYNCED',
  FAILED = 'FAILED',
}

/**
 * DTO untuk log sinkronisasi
 */
export class LogSinkronisasiDto {
  @ApiProperty({ description: 'ID log' })
  id: string;

  @ApiProperty({ enum: TipeDataSync })
  tipeData: TipeDataSync;

  @ApiProperty({ enum: ArahReplikasiDto })
  arahReplikasi: ArahReplikasiDto;

  @ApiProperty({ enum: StatusSyncDto })
  status: StatusSyncDto;

  @ApiProperty()
  retryCount: number;

  @ApiProperty()
  lastAttempt: Date;

  @ApiPropertyOptional()
  errorMessage?: string;

  @ApiPropertyOptional()
  referenceId?: string;
}

/**
 * DTO untuk status sinkronisasi
 */
export class StatusSinkronisasiDto {
  @ApiProperty({ description: 'Jumlah transaksi pending' })
  pendingCount: number;

  @ApiProperty({ description: 'Jumlah transaksi sudah synced' })
  syncedCount: number;

  @ApiProperty({ description: 'Jumlah transaksi gagal' })
  failedCount: number;

  @ApiPropertyOptional({ description: 'Waktu sinkronisasi terakhir' })
  lastSyncAt?: Date;
}

/**
 * DTO untuk trigger sinkronisasi
 */
export class TriggerSyncDto {
  @ApiProperty({ description: 'Force sync meskipun tidak ada perubahan', default: false })
  @IsNotEmpty()
  force?: boolean = false;
}
