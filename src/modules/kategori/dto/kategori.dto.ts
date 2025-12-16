import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO untuk membuat kategori baru
 */
export class CreateKategoriDto {
  @ApiProperty({
    description: 'Nama kategori produk',
    example: 'Sembako',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: 'Nama kategori wajib diisi' })
  @MaxLength(50, { message: 'Nama kategori maksimal 50 karakter' })
  nama: string;

  @ApiPropertyOptional({
    description: 'Deskripsi kategori',
    example: 'Kategori untuk produk kebutuhan pokok',
  })
  @IsString()
  @IsOptional()
  deskripsi?: string;
}

/**
 * DTO untuk update kategori
 */
export class UpdateKategoriDto {
  @ApiPropertyOptional({
    description: 'Nama kategori produk',
    example: 'Sembako',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'Nama kategori maksimal 50 karakter' })
  nama?: string;

  @ApiPropertyOptional({
    description: 'Deskripsi kategori',
    example: 'Kategori untuk produk kebutuhan pokok',
  })
  @IsString()
  @IsOptional()
  deskripsi?: string;
}

/**
 * Response DTO untuk kategori
 */
export class KategoriResponseDto {
  @ApiProperty({ description: 'ID kategori (UUID)' })
  id: string;

  @ApiProperty({ description: 'Nama kategori' })
  nama: string;

  @ApiPropertyOptional({ description: 'Deskripsi kategori' })
  deskripsi?: string;

  @ApiProperty({ description: 'Waktu dibuat' })
  createdAt: Date;

  @ApiProperty({ description: 'Waktu diupdate' })
  updatedAt: Date;
}
