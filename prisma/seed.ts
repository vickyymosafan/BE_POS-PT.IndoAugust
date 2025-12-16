import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface KategoriData {
  nama: string;
  deskripsi: string;
}

interface ProdukData {
  kodeProduk: string;
  namaProduk: string;
  kategori: string;
  hargaDasar: number;
}

/**
 * Seed data awal untuk sistem POS
 */
async function main() {
  console.log('🌱 Memulai seeding database...');

  // Seed Kategori
  const kategoriData: KategoriData[] = [
    { nama: 'Sembako', deskripsi: 'Kebutuhan pokok sembilan bahan pokok' },
    { nama: 'Minuman', deskripsi: 'Minuman kemasan dan siap minum' },
    { nama: 'Makanan', deskripsi: 'Makanan ringan dan kemasan' },
    {
      nama: 'Kebersihan',
      deskripsi: 'Produk kebersihan rumah tangga dan pribadi',
    },
  ];

  const kategoris: Record<string, string> = {};

  for (const kat of kategoriData) {
    const kategori = await prisma.kategori.upsert({
      where: { nama: kat.nama },
      update: {},
      create: kat,
    });
    kategoris[kat.nama] = kategori.id;
    console.log(`✅ Kategori: ${kat.nama}`);
  }

  // Seed Produk
  const produkData: ProdukData[] = [
    // Sembako
    {
      kodeProduk: 'PRD-001',
      namaProduk: 'Beras Premium 5kg',
      kategori: 'Sembako',
      hargaDasar: 75000,
    },
    {
      kodeProduk: 'PRD-002',
      namaProduk: 'Gula Pasir 1kg',
      kategori: 'Sembako',
      hargaDasar: 15000,
    },
    {
      kodeProduk: 'PRD-003',
      namaProduk: 'Minyak Goreng 1L',
      kategori: 'Sembako',
      hargaDasar: 18000,
    },
    {
      kodeProduk: 'PRD-004',
      namaProduk: 'Telur Ayam 1kg',
      kategori: 'Sembako',
      hargaDasar: 28000,
    },
    {
      kodeProduk: 'PRD-005',
      namaProduk: 'Tepung Terigu 1kg',
      kategori: 'Sembako',
      hargaDasar: 12000,
    },
    // Minuman
    {
      kodeProduk: 'PRD-006',
      namaProduk: 'Air Mineral 600ml',
      kategori: 'Minuman',
      hargaDasar: 4000,
    },
    {
      kodeProduk: 'PRD-007',
      namaProduk: 'Teh Kotak 250ml',
      kategori: 'Minuman',
      hargaDasar: 5000,
    },
    {
      kodeProduk: 'PRD-008',
      namaProduk: 'Susu UHT 1L',
      kategori: 'Minuman',
      hargaDasar: 18000,
    },
    {
      kodeProduk: 'PRD-009',
      namaProduk: 'Kopi Sachet',
      kategori: 'Minuman',
      hargaDasar: 2000,
    },
    // Makanan
    {
      kodeProduk: 'PRD-010',
      namaProduk: 'Mie Instan',
      kategori: 'Makanan',
      hargaDasar: 3500,
    },
    {
      kodeProduk: 'PRD-011',
      namaProduk: 'Biskuit Kaleng',
      kategori: 'Makanan',
      hargaDasar: 35000,
    },
    {
      kodeProduk: 'PRD-012',
      namaProduk: 'Snack Kentang',
      kategori: 'Makanan',
      hargaDasar: 12000,
    },
    // Kebersihan
    {
      kodeProduk: 'PRD-013',
      namaProduk: 'Sabun Mandi',
      kategori: 'Kebersihan',
      hargaDasar: 5000,
    },
    {
      kodeProduk: 'PRD-014',
      namaProduk: 'Shampo Sachet',
      kategori: 'Kebersihan',
      hargaDasar: 1500,
    },
    {
      kodeProduk: 'PRD-015',
      namaProduk: 'Deterjen 1kg',
      kategori: 'Kebersihan',
      hargaDasar: 25000,
    },
  ];

  for (const prod of produkData) {
    const produk = await prisma.produk.upsert({
      where: { kodeProduk: prod.kodeProduk },
      update: {},
      create: {
        kodeProduk: prod.kodeProduk,
        namaProduk: prod.namaProduk,
        kategoriId: kategoris[prod.kategori],
        hargaDasar: prod.hargaDasar,
        isAktif: true,
      },
    });

    // Buat stok di pusat
    await prisma.stok.upsert({
      where: {
        produkId_lokasi: {
          produkId: produk.id,
          lokasi: 'PUSAT',
        },
      },
      update: {},
      create: {
        produkId: produk.id,
        lokasi: 'PUSAT',
        jumlah: 100,
      },
    });

    console.log(`✅ Produk: ${prod.namaProduk}`);
  }

  console.log('');
  console.log('🎉 Seeding selesai!');
  console.log(`   - ${kategoriData.length} kategori`);
  console.log(`   - ${produkData.length} produk`);
}

main()
  .catch((e: Error) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
