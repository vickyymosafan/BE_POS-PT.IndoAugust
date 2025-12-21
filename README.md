<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="100" alt="NestJS Logo" />
</p>

<h1 align="center">🛒 POS PT. IndoAugust</h1>

<p align="center">
  <strong>Sistem Point of Sale dengan Replikasi Data Terdistribusi (Dual Database)</strong>
</p>

<p align="center">
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" /></a>
  <a href="https://nestjs.com"><img src="https://img.shields.io/badge/NestJS-v11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-v5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://www.postgresql.org"><img src="https://img.shields.io/badge/PostgreSQL-v15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
  <a href="https://www.prisma.io"><img src="https://img.shields.io/badge/Prisma-v5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" /></a>
</p>

<p align="center">
  <a href="https://redis.io"><img src="https://img.shields.io/badge/Redis-Queue-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis" /></a>
  <a href="https://socket.io"><img src="https://img.shields.io/badge/Socket.IO-Realtime-010101?style=flat-square&logo=socket.io&logoColor=white" alt="Socket.IO" /></a>
  <a href="https://swagger.io"><img src="https://img.shields.io/badge/Swagger-API_Docs-85EA2D?style=flat-square&logo=swagger&logoColor=black" alt="Swagger" /></a>
</p>

---

## 📋 Deskripsi

**POS PT. IndoAugust** adalah sistem Point of Sale backend yang dirancang untuk PT. Indoagustus dengan arsitektur **dual database** untuk menangani operasi di:

- 🏢 **Pusat (Jember)** - Mengelola master produk, kategori, dan harga dasar
- 🏪 **Cabang (Bondowoso)** - Menangani transaksi penjualan dan stok lokal

Sistem ini menggunakan **replikasi data asinkron** untuk menjaga konsistensi data antara pusat dan cabang dengan mekanisme retry otomatis.

---

## ✨ Fitur Utama

| Fitur                      | Deskripsi                                            |
| -------------------------- | ---------------------------------------------------- |
| 🔄 **Replikasi Parsial**   | Hanya produk aktif & harga terbaru yang direplikasi  |
| 📦 **Replikasi Penuh**     | Semua transaksi cabang disimpan di pusat             |
| ⚡ **Replikasi Asinkron**  | Background job dengan Bull Queue dan retry mechanism |
| 🔒 **Replikasi Satu Arah** | Pusat → Cabang (readonly untuk master data)          |
| 🌐 **Real-time Updates**   | WebSocket untuk notifikasi sync status               |
| 📊 **Dashboard Web**       | UI untuk monitoring pusat dan cabang                 |
| 📚 **API Documentation**   | Swagger/OpenAPI terintegrasi                         |

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                      SISTEM POS PT. INDOAUGUST                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────┐              ┌─────────────────┐         │
│   │   🏢 PUSAT      │              │   🏪 CABANG     │         │
│   │   (Jember)      │              │  (Bondowoso)    │         │
│   ├─────────────────┤              ├─────────────────┤         │
│   │ • Master Produk │ ──────────▶  │ • Read Produk   │         │
│   │ • Kategori      │  Replikasi   │ • Transaksi     │         │
│   │ • Harga Dasar   │  Parsial     │ • Stok Lokal    │         │
│   └────────┬────────┘              └────────┬────────┘         │
│            │                                │                   │
│            │         ◀──────────────────────┘                   │
│            │           Replikasi Penuh                          │
│            │           (Transaksi)                              │
│            ▼                                                    │
│   ┌─────────────────┐                                           │
│   │   PostgreSQL    │                                           │
│   │   pos_pusat     │                                           │
│   └─────────────────┘                                           │
│                                                                 │
│   ┌─────────────────┐              ┌─────────────────┐         │
│   │   Bull Queue    │◀────────────▶│     Redis       │         │
│   │  (Background)   │              │   (Queue DB)    │         │
│   └─────────────────┘              └─────────────────┘         │
│                                                                 │
│   ┌─────────────────┐                                           │
│   │   Socket.IO     │  ───▶  Real-time Notifications           │
│   └─────────────────┘                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer          | Technology      | Version |
| -------------- | --------------- | ------- |
| **Framework**  | NestJS          | v11.0.1 |
| **Language**   | TypeScript      | v5.7.3  |
| **Runtime**    | Node.js         | v18+    |
| **Database**   | PostgreSQL      | v15+    |
| **ORM**        | Prisma          | v5.22.0 |
| **Queue**      | Bull (Redis)    | v4.16.5 |
| **Real-time**  | Socket.IO       | v4.8.1  |
| **API Docs**   | Swagger         | v11.2.3 |
| **Validation** | class-validator | v0.14.3 |
| **Template**   | EJS             | v3.1.10 |
| **Testing**    | Jest            | v30.0.0 |

---

## 📦 Prerequisites (Persiapan)

Sebelum memulai, pastikan Anda telah menginstall software berikut:

### 1. Node.js (v18 atau lebih tinggi)

Download dari: https://nodejs.org/en/download/

```powershell
# Verifikasi instalasi
node --version    # Harus menampilkan v18.x.x atau lebih
npm --version     # Harus menampilkan v9.x.x atau lebih
```

### 2. PostgreSQL (v15 atau lebih tinggi)

Download dari: https://www.postgresql.org/download/windows/

> ⚠️ **PENTING**: Saat instalasi, catat password yang Anda buat untuk user `postgres`!

```powershell
# Verifikasi instalasi (setelah restart terminal)
psql --version    # Harus menampilkan psql (PostgreSQL) 15.x
```

### 3. Redis (v7 atau lebih tinggi)

**Opsi A: Menggunakan Docker (Direkomendasikan)**

```powershell
# Install Docker Desktop terlebih dahulu dari https://www.docker.com/products/docker-desktop/
docker run -d --name redis -p 6379:6379 redis:alpine
```

**Opsi B: Install Redis untuk Windows**

Download dari: https://github.com/microsoftarchive/redis/releases

### 4. Git

Download dari: https://git-scm.com/download/win

```powershell
# Verifikasi instalasi
git --version
```

---

## 🚀 TUTORIAL SETUP LENGKAP (Step-by-Step)

Ikuti panduan ini secara berurutan untuk setup project dari awal hingga bisa menjalankan aplikasi dengan 2 database.

---

### 📌 Step 1: Clone Repository

```powershell
# Clone repository
git clone https://github.com/vickyymosafan/BE_POS-PT.IndoAugust.git

# Masuk ke direktori project
cd BE_POS-PT.IndoAugust
```

---

### 📌 Step 2: Install Dependencies

```powershell
# Install semua dependencies
npm install
```

> ⏱️ Proses ini mungkin memakan waktu 2-5 menit tergantung koneksi internet.

---

### 📌 Step 3: Membuat 2 Database PostgreSQL

> ⚠️ **PENTING**: Anda harus membuat **2 database** yaitu `pos_pusat` dan `pos_cabang`.

**Metode A: Menggunakan Command Line (psql)**

```powershell
# Buka terminal dan jalankan psql
psql -U postgres

# Masukkan password PostgreSQL Anda saat diminta

# Buat database PUSAT (Jember)
CREATE DATABASE pos_pusat;

# Buat database CABANG (Bondowoso)
CREATE DATABASE pos_cabang;

# Verifikasi database sudah dibuat
\l

# Keluar dari psql
\q
```

**Metode B: Menggunakan pgAdmin (GUI)**

1. Buka pgAdmin dari Start Menu
2. Klik kanan pada "Databases" → "Create" → "Database..."
3. Isi Name: `pos_pusat` → Klik "Save"
4. Ulangi langkah 2-3 untuk membuat database `pos_cabang`

**Verifikasi Database Berhasil Dibuat:**

```powershell
psql -U postgres -c "\l"
# Output harus menampilkan pos_pusat dan pos_cabang dalam daftar
```

---

### 📌 Step 4: Konfigurasi Environment Variables

```powershell
# Copy file environment template
copy .env.example .env

# Buka file .env dengan editor favorit Anda (Notepad, VS Code, dll)
```

**Edit file `.env` sesuai konfigurasi PostgreSQL Anda:**

```env
# Environment Setup untuk Sistem POS PT. Indoagustus

# Database URL utama (untuk Prisma generate/migrate)
DATABASE_URL="postgresql://postgres:PASSWORD_ANDA@localhost:5432/pos_pusat?schema=public"

# Database Pusat (Jember)
DATABASE_PUSAT_URL="postgresql://postgres:PASSWORD_ANDA@localhost:5432/pos_pusat?schema=public"

# Database Cabang (Bondowoso)
DATABASE_CABANG_URL="postgresql://postgres:PASSWORD_ANDA@localhost:5432/pos_cabang?schema=public"
REDIS_PORT="6379"

# Aplikasi
PORT=3000
NODE_ENV="development"
```

> ⚠️ **GANTI `PASSWORD_ANDA`** dengan password PostgreSQL yang Anda buat saat instalasi!

---

### 📌 Step 5: Migrasi Schema ke Database PUSAT

```powershell
# Generate Prisma Client terlebih dahulu
npx prisma generate

# Migrasi schema ke database PUSAT
npx prisma migrate deploy
```

---

### 📌 Step 6: Migrasi Schema ke Database CABANG

> ⚠️ **PENTING**: Prisma secara default hanya membaca `DATABASE_URL`. Untuk migrasi ke database cabang, kita perlu mengganti sementara nilai `DATABASE_URL`.

**PowerShell:**

```powershell
# Set DATABASE_URL ke database CABANG secara temporary
$env:DATABASE_URL="postgresql://postgres:PASSWORD_ANDA@localhost:5432/pos_cabang?schema=public"

# Jalankan migrasi ke database CABANG
npx prisma migrate deploy

# Reset kembali ke default (opsional, karena .env akan dibaca ulang saat restart)
$env:DATABASE_URL="postgresql://postgres:PASSWORD_ANDA@localhost:5432/pos_pusat?schema=public"
```

**CMD (Command Prompt):**

```cmd
:: Set DATABASE_URL ke database CABANG secara temporary
set DATABASE_URL=postgresql://postgres:PASSWORD_ANDA@localhost:5432/pos_cabang?schema=public

:: Jalankan migrasi ke database CABANG
npx prisma migrate deploy
```

**Git Bash / Linux / macOS:**

```bash
# Set DATABASE_URL ke database CABANG secara temporary dan jalankan migrasi
DATABASE_URL="postgresql://postgres:PASSWORD_ANDA@localhost:5432/pos_cabang?schema=public" npx prisma migrate deploy
```

---

### 📌 Step 7: Verifikasi Tabel di Kedua Database

```powershell
# Cek tabel di database PUSAT
psql -U postgres -d pos_pusat -c "\dt"

# Cek tabel di database CABANG
psql -U postgres -d pos_cabang -c "\dt"
```

**Output yang diharapkan (6 tabel):**

```
            List of relations
 Schema |        Name        | Type  |  Owner
--------+--------------------+-------+----------
 public | _prisma_migrations | table | postgres
 public | detail_transaksi   | table | postgres
 public | kategori           | table | postgres
 public | log_sinkronisasi   | table | postgres
 public | produk             | table | postgres
 public | stok               | table | postgres
 public | transaksi          | table | postgres
```

---

### 📌 Step 8: (Opsional) Seed Data Awal

```powershell
# Seed data ke database PUSAT
npx prisma db seed
```

---

### 📌 Step 9: Jalankan Redis

**Jika menggunakan Docker:**

```powershell
# Pastikan container Redis sudah berjalan
docker start redis

# Verifikasi Redis aktif
docker ps
```

**Jika menggunakan Redis Native:**

```powershell
# Jalankan Redis server
redis-server
```

---

### 📌 Step 10: Jalankan Aplikasi

```powershell
# Development mode (hot-reload)
npm run start:dev
```

**Output yang diharapkan:**

```
[Nest] LOG [NestFactory] Starting Nest application...
✅ Database Pusat (Jember) connected
✅ Database Cabang (Bondowoso) connected
[Nest] LOG [NestApplication] Nest application successfully started
🚀 Application is running on: http://localhost:3000
```

---

### 📌 Step 11: Verifikasi Setup Berhasil

Buka browser dan akses URL berikut:

| URL                            | Deskripsi                    | Status |
| ------------------------------ | ---------------------------- | ------ |
| `http://localhost:3000`        | Landing Page                 | ✅     |
| `http://localhost:3000/api`    | 📚 Swagger API Documentation | ✅     |
| `http://localhost:3000/pusat`  | 🏢 Dashboard Pusat           | ✅     |
| `http://localhost:3000/cabang` | 🏪 Dashboard Cabang          | ✅     |

---

## 🔧 Troubleshooting (Mengatasi Masalah Umum)

### ❌ Error: `connect ECONNREFUSED 127.0.0.1:5432`

**Penyebab**: PostgreSQL tidak berjalan.

**Solusi:**

```powershell
# Windows: Cek status service PostgreSQL
Get-Service -Name "postgresql*"

# Jika tidak running, start service
Start-Service -Name "postgresql-x64-15"  # Sesuaikan dengan versi Anda
```

Atau buka **Services** (Win + R → `services.msc`) dan start "postgresql-x64-15".

---

### ❌ Error: `database "pos_pusat" does not exist`

**Penyebab**: Database belum dibuat.

**Solusi**: Ikuti [Step 3](#-step-3-membuat-2-database-postgresql) untuk membuat database.

---

### ❌ Error: `password authentication failed for user "postgres"`

**Penyebab**: Password di `.env` tidak sesuai dengan password PostgreSQL.

**Solusi:**

1. Buka file `.env`
2. Ganti `PASSWORD_ANDA` dengan password yang benar
3. Restart aplikasi

---

### ❌ Error: `connect ECONNREFUSED 127.0.0.1:6379`

**Penyebab**: Redis tidak berjalan.

**Solusi:**

```powershell
# Jika menggunakan Docker
docker start redis

# Jika menggunakan Redis native
redis-server
```

---

### ❌ Error: `P3009: migrate found failed migrations`

**Penyebab**: Ada migrasi yang gagal sebelumnya.

**Solusi:**

```powershell
# Reset migrasi (PERINGATAN: akan menghapus semua data!)
npx prisma migrate reset

# Atau resolve secara manual
npx prisma migrate resolve --applied "20251218110334_init"
```

---

### ❌ Error: `Port 3000 is already in use`

**Penyebab**: Port 3000 sudah digunakan aplikasi lain.

**Solusi:**

```powershell
# Cari proses yang menggunakan port 3000
netstat -ano | findstr :3000

# Kill proses tersebut (ganti PID dengan nomor dari output di atas)
taskkill /PID <PID> /F

# Atau ubah port di .env
# PORT=3001
```

---

## ⚙️ Environment Variables Reference

| Variable              | Deskripsi                       | Default                                                    | Required |
| --------------------- | ------------------------------- | ---------------------------------------------------------- | -------- |
| `DATABASE_URL`        | URL database untuk Prisma CLI   | `postgresql://postgres:postgres@localhost:5432/pos_pusat`  | ✅       |
| `DATABASE_PUSAT_URL`  | URL database Pusat (Jember)     | `postgresql://postgres:postgres@localhost:5432/pos_pusat`  | ✅       |
| `DATABASE_CABANG_URL` | URL database Cabang (Bondowoso) | `postgresql://postgres:postgres@localhost:5432/pos_cabang` | ✅       |
| `REDIS_PORT`          | Port Redis untuk Bull Queue     | `6379`                                                     | ✅       |
| `PORT`                | Port aplikasi                   | `3000`                                                     | ❌       |
| `NODE_ENV`            | Environment mode                | `development`                                              | ❌       |

---

## 📁 Struktur Project

```
POS-PT.IndoAugust/
├── prisma/
│   ├── migrations/            # Database migrations
│   ├── schema.prisma          # Database schema (6 models)
│   └── seed.ts                # Seed data awal
├── src/
│   ├── modules/
│   │   ├── kategori/          # Module kategori produk
│   │   ├── produk/            # Module master produk
│   │   ├── stok/              # Module stok per lokasi
│   │   ├── transaksi/         # Module transaksi penjualan
│   │   ├── sinkronisasi/      # Module sync pusat-cabang
│   │   └── realtime/          # Module WebSocket
│   ├── prisma/
│   │   ├── prisma-pusat.service.ts    # Prisma client untuk DB PUSAT
│   │   ├── prisma-cabang.service.ts   # Prisma client untuk DB CABANG
│   │   └── prisma.module.ts           # Prisma module
│   ├── views/
│   │   ├── index.ejs          # Landing page
│   │   ├── pusat.ejs          # Dashboard pusat
│   │   └── cabang.ejs         # Dashboard cabang
│   ├── app.module.ts          # Root module
│   └── main.ts                # Application entry point
├── test/
│   ├── app.e2e-spec.ts        # E2E tests
│   └── jest-e2e.json          # Jest E2E config
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
└── README.md                  # Documentation (file ini)
```

---

## 📊 Database Schema

Project ini menggunakan **6 model database**:

| Model             | Deskripsi                   | Lokasi         |
| ----------------- | --------------------------- | -------------- |
| `Kategori`        | Master kategori produk      | Pusat + Cabang |
| `Produk`          | Master data produk          | Pusat + Cabang |
| `Stok`            | Stok per lokasi             | Pusat + Cabang |
| `Transaksi`       | Header transaksi penjualan  | Pusat + Cabang |
| `DetailTransaksi` | Detail item dalam transaksi | Pusat + Cabang |
| `LogSinkronisasi` | Log aktivitas sinkronisasi  | Pusat + Cabang |

---

## 📡 API Endpoints

### Pusat (HQ)

| Method | Endpoint                | Deskripsi                   |
| ------ | ----------------------- | --------------------------- |
| `GET`  | `/kategori`             | List semua kategori         |
| `POST` | `/kategori`             | Buat kategori baru          |
| `GET`  | `/produk`               | List semua produk           |
| `POST` | `/produk`               | Buat produk baru            |
| `PUT`  | `/produk/:id`           | Update produk               |
| `GET`  | `/stok`                 | List stok pusat             |
| `POST` | `/sinkronisasi/trigger` | Trigger replikasi ke cabang |

### Cabang (Branch)

| Method | Endpoint               | Deskripsi             |
| ------ | ---------------------- | --------------------- |
| `GET`  | `/cabang/produk`       | List produk di cabang |
| `GET`  | `/cabang/stok`         | List stok cabang      |
| `POST` | `/transaksi`           | Buat transaksi baru   |
| `GET`  | `/transaksi`           | List transaksi        |
| `GET`  | `/sinkronisasi/status` | Cek status sync       |

> 📚 Dokumentasi lengkap tersedia di Swagger: `http://localhost:3000/api`

---

## 🔌 WebSocket Events

Namespace: `/ws`

| Event            | Direction       | Payload                 | Deskripsi                 |
| ---------------- | --------------- | ----------------------- | ------------------------- |
| `sync_status`    | Server → Client | `{ status, timestamp }` | Status sinkronisasi       |
| `transaksi_baru` | Server → Client | `{ transaksi }`         | Notifikasi transaksi baru |
| `produk_update`  | Server → Client | `{ produk }`            | Notifikasi update produk  |

### Contoh Penggunaan

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/ws');

socket.on('sync_status', (data) => {
  console.log('Sync status:', data);
});

socket.on('transaksi_baru', (data) => {
  console.log('Transaksi baru:', data);
});
```

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

---

## 🏃 Menjalankan Aplikasi

```bash
# Development mode (hot-reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

---

## 🚢 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production database URLs
- [ ] Setup Redis for production
- [ ] Run `npm run build`
- [ ] Configure reverse proxy (Nginx)
- [ ] Setup SSL/TLS
- [ ] Configure monitoring & logging

### Build Production

```bash
npm run build
npm run start:prod
```

---

## 🤝 Contributing

1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'feat: add amazing feature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### Commit Convention

Gunakan [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Fitur baru
- `fix:` - Bug fix
- `docs:` - Dokumentasi
- `style:` - Formatting
- `refactor:` - Refactoring
- `test:` - Testing
- `chore:` - Maintenance

---

## 📄 License

Project ini bersifat **private** dan **UNLICENSED**.

---

## 👨‍💻 Author

**Vicky Mosafan**

- GitHub: [@vickyymosafan](https://github.com/vickyymosafan)

---

<p align="center">
  <sub>Built with ❤️ using NestJS</sub>
</p>
