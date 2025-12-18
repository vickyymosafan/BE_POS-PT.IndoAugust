import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import {
  SinkronisasiPusatController,
  SinkronisasiCabangController,
} from './sinkronisasi.controller';
import { SinkronisasiService } from './sinkronisasi.service';
import { ProdukModule } from '../produk';
import { TransaksiModule } from '../transaksi';
import { RealtimeModule } from '../realtime';
import {
  SinkronisasiProcessor,
  SINKRONISASI_QUEUE,
} from './processors/sinkronisasi.processor';

/**
 * SinkronisasiModule - Modul untuk 4 sistem replikasi
 * Includes Bull Queue for async replication
 */
@Module({
  imports: [
    forwardRef(() => ProdukModule),
    forwardRef(() => TransaksiModule),
    RealtimeModule,
    BullModule.registerQueue({
      name: SINKRONISASI_QUEUE,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
  ],
  controllers: [SinkronisasiPusatController, SinkronisasiCabangController],
  providers: [SinkronisasiService, SinkronisasiProcessor],
  exports: [SinkronisasiService],
})
export class SinkronisasiModule {}
