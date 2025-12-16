import { Module } from '@nestjs/common';
import { KategoriController } from './kategori.controller';
import { KategoriService } from './kategori.service';

/**
 * KategoriModule - Modul untuk master kategori produk
 */
@Module({
  controllers: [KategoriController],
  providers: [KategoriService],
  exports: [KategoriService],
})
export class KategoriModule {}
