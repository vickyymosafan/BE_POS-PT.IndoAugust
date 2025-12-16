import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
