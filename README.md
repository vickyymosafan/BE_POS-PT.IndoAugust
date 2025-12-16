<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="100" alt="NestJS Logo" />
</p>

<h1 align="center">🛒 POS PT. IndoAugust</h1>

<p align="center">
  <strong>Sistem Point of Sale dengan Replikasi Data Terdistribusi</strong>
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

## 📦 Prerequisites

Sebelum memulai, pastikan Anda telah menginstall:

- **Node.js** v18 atau lebih tinggi
- **npm** v9 atau lebih tinggi
- **PostgreSQL** v15 atau lebih tinggi
- **Redis** v7 atau lebih tinggi (untuk Bull Queue)
- **Git** untuk version control

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/vickyymosafan/BE_POS-PT.IndoAugust.git
cd BE_POS-PT.IndoAugust
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
# Copy environment file
cp .env.example .env

# Edit sesuai konfigurasi lokal Anda
```

### 4. Setup Database

```bash
# Buat database PostgreSQL
createdb pos_pusat
createdb pos_cabang

# Jalankan migrasi Prisma
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# (Opsional) Seed data awal
npx prisma db seed
```

### 5. Jalankan Redis

```bash
# Windows (dengan Redis installed)
redis-server

# Atau menggunakan Docker
docker run -d -p 6379:6379 redis:alpine
```

---

## ⚙️ Konfigurasi

### Environment Variables

| Variable              | Description                     | Default                                                    |
| --------------------- | ------------------------------- | ---------------------------------------------------------- |
| `DATABASE_URL`        | URL database untuk Prisma       | `postgresql://postgres:postgres@localhost:5432/pos_pusat`  |
| `DATABASE_PUSAT_URL`  | URL database Pusat (Jember)     | `postgresql://postgres:postgres@localhost:5432/pos_pusat`  |
| `DATABASE_CABANG_URL` | URL database Cabang (Bondowoso) | `postgresql://postgres:postgres@localhost:5432/pos_cabang` |
| `REDIS_PORT`          | Port Redis untuk Bull Queue     | `6379`                                                     |
| `PORT`                | Port aplikasi                   | `3000`                                                     |
| `NODE_ENV`            | Environment mode                | `development`                                              |

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

### Akses Aplikasi

| URL                            | Deskripsi                    |
| ------------------------------ | ---------------------------- |
| `http://localhost:3000`        | Landing Page                 |
| `http://localhost:3000/api`    | 📚 Swagger API Documentation |
| `http://localhost:3000/pusat`  | 🏢 Dashboard Pusat           |
| `http://localhost:3000/cabang` | 🏪 Dashboard Cabang          |

---

## 📁 Struktur Project

```
POS-PT.IndoAugust/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── src/
│   ├── modules/
│   │   ├── kategori/          # Module kategori produk
│   │   ├── produk/            # Module master produk
│   │   ├── stok/              # Module stok per lokasi
│   │   ├── transaksi/         # Module transaksi penjualan
│   │   ├── sinkronisasi/      # Module sync pusat-cabang
│   │   └── realtime/          # Module WebSocket
│   ├── prisma/
│   │   ├── prisma-pusat.service.ts    # Prisma client pusat
│   │   ├── prisma-cabang.service.ts   # Prisma client cabang
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
└── README.md                  # Documentation
```

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
