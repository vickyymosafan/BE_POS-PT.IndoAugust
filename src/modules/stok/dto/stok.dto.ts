import { IsNotEmpty, IsNumber, IsUUID, Min, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Enum lokasi stok
 */
export enum LokasiStok {
  PUSAT = 'PUSAT',
  CABANG_BONDOWOSO = 'CABANG_BONDOWOSO',
}

/**
 * DTO untuk update stok
 */
export class UpdateStokDto {
  @ApiProperty({ description: 'ID produk', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  produkId: string;

  @ApiProperty({ description: 'Jumlah stok baru', example: 100 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  jumlah: number;

  @ApiProperty({ enum: LokasiStok, description: 'Lokasi stok' })
  @IsEnum(LokasiStok)
  lokasi: LokasiStok;
}

/**
 * DTO untuk kurangi stok
 */
export class KurangiStokDto {
  @ApiProperty({ description: 'ID produk' })
  @IsNotEmpty()
  @IsUUID()
  produkId: string;

  @ApiProperty({ description: 'Jumlah yang dikurangi', example: 5 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  qty: number;
}

/**
 * DTO response stok
 */
export class StokResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  produkId: string;

  @ApiProperty({ enum: LokasiStok })
  lokasi: LokasiStok;

  @ApiProperty()
  jumlah: number;

  @ApiProperty()
  lastUpdated: Date;
}
