import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { PrismaModule } from './prisma';
import { KategoriModule } from './modules/kategori';
import { ProdukModule } from './modules/produk';
import { StokModule } from './modules/stok';
import { TransaksiModule } from './modules/transaksi';
import { SinkronisasiModule } from './modules/sinkronisasi';
import { RealtimeModule } from './modules/realtime';
import { ViewController } from './views/view.controller';

/**
 * AppModule - Root module aplikasi
 * Sistem POS PT. Indoagustus dengan Replikasi Data Terdistribusi
 */
@Module({
  imports: [
    // Konfigurasi environment
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Bull Queue configuration for async replication
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: 'localhost',
          port: parseInt(configService.get('REDIS_PORT') || '6379', 10),
        },
      }),
      inject: [ConfigService],
    }),

    // Database (dual datasource)
    PrismaModule,

    // Modul fitur
    KategoriModule,
    ProdukModule,
    StokModule,
    TransaksiModule,
    SinkronisasiModule,

    // Realtime WebSocket
    RealtimeModule,
  ],
  controllers: [ViewController],
})
export class AppModule {}
