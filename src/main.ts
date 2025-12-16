import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Validation pipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS
  app.enableCors();

  // Static files dan views
  app.useStaticAssets(join(__dirname, '..', 'src', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));
  app.setViewEngine('ejs');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Sistem POS PT. Indoagustus')
    .setDescription(
      `
      API Documentation untuk Sistem POS dengan Replikasi Data Terdistribusi
      
      ## Fitur Utama
      - **Pusat (Jember)**: Kelola master produk, kategori, harga dasar
      - **Cabang (Bondowoso)**: Transaksi penjualan, stok lokal
      
      ## Sistem Replikasi
      1. **Replikasi Parsial**: Hanya produk aktif & harga terbaru
      2. **Replikasi Penuh**: Semua transaksi cabang disimpan di pusat
      3. **Replikasi Asinkron**: Background job dengan retry queue
      4. **Replikasi Satu Arah**: Pusat → Cabang (readonly)
      
      ## WebSocket
      Namespace: \`/ws\`
      Events: \`sync_status\`, \`transaksi_baru\`, \`produk_update\`
    `,
    )
    .setVersion('1.0')
    .addTag('Pusat - Kategori', 'Endpoint untuk master kategori (Pusat)')
    .addTag('Pusat - Produk', 'Endpoint untuk master produk (Pusat)')
    .addTag('Pusat - Stok', 'Endpoint untuk stok pusat')
    .addTag('Pusat - Transaksi', 'Endpoint untuk melihat transaksi dari cabang')
    .addTag(
      'Pusat - Sinkronisasi',
      'Endpoint untuk trigger replikasi ke cabang',
    )
    .addTag('Cabang - Stok', 'Endpoint untuk stok lokal cabang')
    .addTag('Cabang - Transaksi', 'Endpoint untuk transaksi penjualan')
    .addTag(
      'Cabang - Sinkronisasi',
      'Endpoint untuk status pengiriman ke pusat',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin-bottom: 20px; }
    `,
    customSiteTitle: 'API Docs - PT. Indoagustus POS',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log('');
  console.log('='.repeat(50));
  console.log('🛒 SISTEM POS PT. INDOAGUSTUS');
  console.log('='.repeat(50));
  console.log(`✅ Server berjalan di: http://localhost:${port}`);
  console.log(`📚 Swagger API Docs: http://localhost:${port}/api`);
  console.log(`🏢 Dashboard Pusat: http://localhost:${port}/pusat`);
  console.log(`🏪 Dashboard Cabang: http://localhost:${port}/cabang`);
  console.log('='.repeat(50));
}

void bootstrap();
