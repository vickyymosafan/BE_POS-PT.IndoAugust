# Product Overview

POS (Point of Sale) system untuk PT. Indoagustus dengan replikasi data terdistribusi antara kantor pusat (Pusat/Jember) dan cabang (Cabang/Bondowoso).

## Fitur Pusat (Headquarters)

User di Pusat dapat melakukan:

### Manajemen Kategori

- Membuat kategori produk baru
- Mengubah nama/deskripsi kategori
- Menghapus kategori (soft delete)
- Melihat daftar semua kategori

### Manajemen Produk

- Menambah produk baru dengan SKU, nama, harga dasar
- Mengubah informasi produk (nama, harga, status aktif)
- Menonaktifkan produk (tidak akan di-sync ke cabang)
- Melihat daftar produk dengan filter dan pagination

### Monitoring & Sinkronisasi

- Melihat status sinkronisasi ke cabang
- Melihat laporan transaksi dari semua cabang
- Trigger manual sync ke cabang
- Melihat history perubahan data

## Fitur Cabang (Branch)

User di Cabang dapat melakukan:

### Transaksi Penjualan

- Membuat transaksi baru (kasir)
- Menambah item ke transaksi
- Menghitung total dengan diskon
- Menyimpan dan mencetak struk

### Manajemen Stok Lokal

- Melihat stok produk yang tersedia
- Melakukan stock opname
- Melihat history pergerakan stok
- Alert stok minimum

### Data Produk (Read-Only)

- Melihat daftar produk dari pusat
- Mencari produk berdasarkan SKU/nama
- Melihat harga terkini

## Replication Strategies

1. **Partial Replication**: Hanya produk aktif dan harga terbaru yang sync ke cabang
2. **Full Replication**: Semua transaksi cabang direplikasi ke pusat
3. **Async Replication**: Background jobs dengan Bull Queue dan retry mechanism
4. **One-way Replication**: Data produk mengalir Pusat → Cabang (read-only di cabang)

## Real-time Features

- WebSocket namespace: `/ws`
- Events: `sync_status`, `transaksi_baru`, `produk_update`
- Room-based subscriptions: `pusat`, `cabang`

## API Endpoints

### Pusat API (`/api/pusat/`)

- `GET/POST /api/pusat/kategori` - CRUD kategori
- `GET/POST /api/pusat/produk` - CRUD produk
- `GET /api/pusat/transaksi` - Laporan transaksi semua cabang
- `POST /api/pusat/sinkronisasi` - Trigger sync manual

### Cabang API (`/api/cabang/`)

- `GET /api/cabang/produk` - Daftar produk (read-only)
- `GET/POST /api/cabang/transaksi` - Transaksi penjualan
- `GET/PUT /api/cabang/stok` - Manajemen stok lokal

## API Documentation

Swagger UI tersedia di `/api` saat server berjalan.
