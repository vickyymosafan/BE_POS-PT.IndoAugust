-- CreateEnum
CREATE TYPE "Lokasi" AS ENUM ('PUSAT', 'CABANG_BONDOWOSO');

-- CreateEnum
CREATE TYPE "StatusSinkronisasi" AS ENUM ('PENDING', 'SYNCED', 'FAILED');

-- CreateEnum
CREATE TYPE "TipeData" AS ENUM ('PRODUK', 'TRANSAKSI');

-- CreateEnum
CREATE TYPE "ArahReplikasi" AS ENUM ('PUSAT_KE_CABANG', 'CABANG_KE_PUSAT');

-- CreateTable
CREATE TABLE "kategori" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kategori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produk" (
    "id" TEXT NOT NULL,
    "kode_produk" TEXT NOT NULL,
    "nama_produk" TEXT NOT NULL,
    "kategori_id" TEXT NOT NULL,
    "harga_dasar" DECIMAL(12,2) NOT NULL,
    "is_aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stok" (
    "id" TEXT NOT NULL,
    "produk_id" TEXT NOT NULL,
    "lokasi" "Lokasi" NOT NULL,
    "jumlah" INTEGER NOT NULL DEFAULT 0,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stok_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaksi" (
    "id" TEXT NOT NULL,
    "nomor_transaksi" TEXT NOT NULL,
    "lokasi_cabang" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_harga" DECIMAL(12,2) NOT NULL,
    "status_sync" "StatusSinkronisasi" NOT NULL DEFAULT 'PENDING',
    "request_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_transaksi" (
    "id" TEXT NOT NULL,
    "transaksi_id" TEXT NOT NULL,
    "produk_id" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "harga_jual" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "detail_transaksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_sinkronisasi" (
    "id" TEXT NOT NULL,
    "tipe_data" "TipeData" NOT NULL,
    "arah_replikasi" "ArahReplikasi" NOT NULL,
    "status" "StatusSinkronisasi" NOT NULL,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "last_attempt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "error_message" TEXT,
    "reference_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_sinkronisasi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kategori_nama_key" ON "kategori"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "produk_kode_produk_key" ON "produk"("kode_produk");

-- CreateIndex
CREATE UNIQUE INDEX "stok_produk_id_lokasi_key" ON "stok"("produk_id", "lokasi");

-- CreateIndex
CREATE UNIQUE INDEX "transaksi_request_id_key" ON "transaksi"("request_id");

-- CreateIndex
CREATE UNIQUE INDEX "transaksi_nomor_transaksi_lokasi_cabang_key" ON "transaksi"("nomor_transaksi", "lokasi_cabang");

-- AddForeignKey
ALTER TABLE "produk" ADD CONSTRAINT "produk_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "kategori"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stok" ADD CONSTRAINT "stok_produk_id_fkey" FOREIGN KEY ("produk_id") REFERENCES "produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_transaksi" ADD CONSTRAINT "detail_transaksi_transaksi_id_fkey" FOREIGN KEY ("transaksi_id") REFERENCES "transaksi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_transaksi" ADD CONSTRAINT "detail_transaksi_produk_id_fkey" FOREIGN KEY ("produk_id") REFERENCES "produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
