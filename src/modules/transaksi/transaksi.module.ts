import { Module, forwardRef } from '@nestjs/common';
import {
  TransaksiCabangController,
  TransaksiPusatController,
} from './transaksi.controller';
import { TransaksiService } from './transaksi.service';
import { StokModule } from '../stok';

/**
 * TransaksiModule - Modul untuk transaksi penjualan
 */
@Module({
  imports: [forwardRef(() => StokModule)],
  controllers: [TransaksiCabangController, TransaksiPusatController],
  providers: [TransaksiService],
  exports: [TransaksiService],
})
export class TransaksiModule {}
