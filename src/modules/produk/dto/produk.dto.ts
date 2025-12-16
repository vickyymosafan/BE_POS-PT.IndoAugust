import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsBoolean,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO untuk membuat produk baru
 */
export class CreateProdukDto {
  @ApiProperty({
    description: 'Kode unik produk',
    example: 'PRD-001',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty({ message: 'Kode produk wajib diisi' })
  @MaxLength(20, { message: 'Kode produk maksimal 20 karakter' })
  kodeProduk: string;

  @ApiProperty({
    description: 'Nama produk',
    example: 'Beras Premium 5kg',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Nama produk wajib diisi' })
  @MaxLength(100, { message: 'Nama produk maksimal 100 karakter' })
  namaProduk: string;

  @ApiProperty({
    description: 'ID kategori produk (UUID)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID('4', { message: 'ID kategori harus berupa UUID valid' })
  @IsNotEmpty({ message: 'Kategori wajib dipilih' })
  kategoriId: string;

  @ApiProperty({
    description: 'Harga dasar produk dari pusat',
    example: 75000,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Harga dasar harus berupa angka' })
  @Min(0, { message: 'Harga dasar tidak boleh negatif' })
  @Type(() => Number)
  hargaDasar: number;

  @ApiPropertyOptional({
    description: 'Status aktif produk',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isAktif?: boolean;
}

/**
 * DTO untuk update produk
 */
export class UpdateProdukDto {
  @ApiPropertyOptional({
    description: 'Kode unik produk',
    example: 'PRD-001',
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Kode produk maksimal 20 karakter' })
  kodeProduk?: string;

  @ApiPropertyOptional({
    description: 'Nama produk',
    example: 'Beras Premium 5kg',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Nama produk maksimal 100 karakter' })
  namaProduk?: string;

  @ApiPropertyOptional({
    description: 'ID kategori produk (UUID)',
  })
  @IsUUID('4', { message: 'ID kategori harus berupa UUID valid' })
  @IsOptional()
  kategoriId?: string;

  @ApiPropertyOptional({
    description: 'Harga dasar produk dari pusat',
    example: 75000,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Harga dasar harus berupa angka' })
  @Min(0, { message: 'Harga dasar tidak boleh negatif' })
  @IsOptional()
  @Type(() => Number)
  hargaDasar?: number;

  @ApiPropertyOptional({
    description: 'Status aktif produk',
  })
  @IsBoolean()
  @IsOptional()
  isAktif?: boolean;
}

/**
 * Response DTO untuk produk
 */
export class ProdukResponseDto {
  @ApiProperty({ description: 'ID produk (UUID)' })
  id: string;

  @ApiProperty({ description: 'Kode unik produk' })
  kodeProduk: string;

  @ApiProperty({ description: 'Nama produk' })
  namaProduk: string;

  @ApiProperty({ description: 'ID kategori' })
  kategoriId: string;

  @ApiProperty({ description: 'Harga dasar' })
  hargaDasar: number;

  @ApiProperty({ description: 'Status aktif' })
  isAktif: boolean;

  @ApiProperty({ description: 'Waktu dibuat' })
  createdAt: Date;

  @ApiProperty({ description: 'Waktu diupdate' })
  updatedAt: Date;
}

/**
 * DTO untuk replikasi produk ke cabang
 */
export class ReplikasiProdukDto {
  @ApiProperty({ description: 'ID produk (UUID)' })
  id: string;

  @ApiProperty({ description: 'Kode unik produk' })
  kodeProduk: string;

  @ApiProperty({ description: 'Nama produk' })
  namaProduk: string;

  @ApiProperty({ description: 'Nama kategori' })
  kategoriNama: string;

  @ApiProperty({ description: 'Harga dasar' })
  hargaDasar: number;
}
