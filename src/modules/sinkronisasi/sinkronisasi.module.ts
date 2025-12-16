import { Module, forwardRef } from '@nestjs/common';
import {
  SinkronisasiPusatController,
  SinkronisasiCabangController,
} from './sinkronisasi.controller';
import { SinkronisasiService } from './sinkronisasi.service';
import { ProdukModule } from '../produk';
import { TransaksiModule } from '../transaksi';
import { RealtimeModule } from '../realtime';

/**
 * SinkronisasiModule - Modul untuk 4 sistem replikasi
 */
@Module({
  imports: [
    forwardRef(() => ProdukModule),
    forwardRef(() => TransaksiModule),
    RealtimeModule,
  ],
  controllers: [SinkronisasiPusatController, SinkronisasiCabangController],
  providers: [SinkronisasiService],
  exports: [SinkronisasiService],
})
export class SinkronisasiModule {}
