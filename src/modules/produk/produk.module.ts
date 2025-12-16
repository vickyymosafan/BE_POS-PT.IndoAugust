import { Module } from '@nestjs/common';
import { ProdukController } from './produk.controller';
import { ProdukCabangController } from './produk-cabang.controller';
import { ProdukService } from './produk.service';

/**
 * ProdukModule - Modul untuk master produk
 */
@Module({
  controllers: [ProdukController, ProdukCabangController],
  providers: [ProdukService],
  exports: [ProdukService],
})
export class ProdukModule {}
