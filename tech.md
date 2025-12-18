# Tech Stack

## Framework & Runtime

- **NestJS 11** - Framework backend
- **Node.js** dengan TypeScript (target ES2023)
- **Express** sebagai HTTP adapter

## Database

- **PostgreSQL** - Setup dual database (Pusat + Cabang)
- **Prisma 5** - ORM dengan service terpisah untuk setiap database
- Lokasi schema: `prisma/schema.prisma`

## Antrian & Real-time

- **Bull** dengan Redis - Pemrosesan job asinkron untuk replikasi
- **Socket.io** - WebSocket untuk update real-time

## Validasi & Dokumentasi

- **class-validator** / **class-transformer** - Validasi DTO
- **Swagger** (@nestjs/swagger) - Dokumentasi API

## Views

- **EJS** - Templating server-side untuk dashboard

## Kualitas Kode

- **ESLint 9** dengan plugin TypeScript
- **Prettier** untuk formatting
- **Jest 30** untuk testing

## Perintah Umum

```bash
# Pengembangan
npm run start:dev      # Jalankan dengan watch mode

# Build & Produksi
npm run build          # Kompilasi TypeScript
npm run start:prod     # Jalankan aplikasi terkompilasi

# Database
npx prisma generate    # Generate Prisma client
npx prisma migrate dev # Jalankan migrasi
npx prisma db seed     # Seed database

# Kualitas Kode
npm run lint           # ESLint dengan auto-fix
npm run format         # Formatting Prettier

# Testing
npm run test           # Unit test
npm run test:e2e       # Test end-to-end
npm run test:cov       # Laporan coverage
```

## Variabel Environment

Diperlukan di `.env`:

- `DATABASE_URL` - URL DB utama untuk Prisma CLI
- `DATABASE_PUSAT_URL` - Database kantor pusat
- `DATABASE_CABANG_URL` - Database cabang
- `REDIS_PORT` - Port Redis untuk antrian Bull
- `PORT` - Port server (default: 3000)
