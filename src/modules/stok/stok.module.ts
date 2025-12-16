import { Module } from '@nestjs/common';
import {
  StokCabangController,
  StokPusatController,
} from './stok.controller';
import { StokService } from './stok.service';

/**
 * StokModule - Modul untuk manajemen stok per lokasi
 */
@Module({
  controllers: [StokCabangController, StokPusatController],
  providers: [StokService],
  exports: [StokService],
})
export class StokModule {}
