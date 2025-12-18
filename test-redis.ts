/**
 * Test Redis Connection
 * Script untuk memverifikasi koneksi Redis
 */

import Redis from 'ioredis';

async function testRedisConnection(): Promise<void> {
  const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
  const redisHost = 'localhost';

  console.log('='.repeat(60));
  console.log('🔍 REDIS CONNECTION TEST');
  console.log('='.repeat(60));
  console.log(`📍 Host: ${redisHost}`);
  console.log(`🔌 Port: ${redisPort}`);
  console.log('-'.repeat(60));

  const redis = new Redis({
    host: redisHost,
    port: redisPort,
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    retryStrategy: (times: number) => {
      if (times > 3) {
        return null; // Stop retrying
      }
      return Math.min(times * 200, 1000);
    },
  });

  try {
    // Test connection
    console.log('\n🔄 Mencoba koneksi ke Redis...');
    await redis.connect();
    console.log('✅ Koneksi Redis BERHASIL!\n');

    // Test PING
    console.log('🏓 Testing PING...');
    const pingResult = await redis.ping();
    console.log(`   Response: ${pingResult}`);

    // Get Redis info
    console.log('\n📊 Redis Server Info:');
    const info = await redis.info('server');
    const serverLines = info.split('\n').filter((line) => {
      return (
        line.includes('redis_version') ||
        line.includes('os:') ||
        line.includes('uptime_in_seconds')
      );
    });
    serverLines.forEach((line) => {
      if (line.trim()) console.log(`   ${line.trim()}`);
    });

    // Get memory info
    console.log('\n💾 Memory Info:');
    const memoryInfo = await redis.info('memory');
    const memoryLines = memoryInfo.split('\n').filter((line) => {
      return line.includes('used_memory_human') || line.includes('maxmemory');
    });
    memoryLines.forEach((line) => {
      if (line.trim()) console.log(`   ${line.trim()}`);
    });

    // Test SET/GET
    console.log('\n🧪 Testing SET/GET operations...');
    const testKey = 'pos:test:connection';
    const testValue = JSON.stringify({
      timestamp: new Date().toISOString(),
      message: 'Redis connection test successful',
    });

    await redis.set(testKey, testValue);
    console.log(`   SET ${testKey} = ${testValue}`);

    const getValue = await redis.get(testKey);
    console.log(`   GET ${testKey} = ${getValue}`);

    // Clean up test key
    await redis.del(testKey);
    console.log(`   DEL ${testKey} (cleanup)`);

    // Check Bull queues
    console.log('\n📬 Checking Bull Queues...');
    const queueKeys = await redis.keys('bull:sinkronisasi-queue:*');
    if (queueKeys.length > 0) {
      console.log(`   Found ${queueKeys.length} queue-related keys:`);
      queueKeys.slice(0, 10).forEach((key) => {
        console.log(`   - ${key}`);
      });
      if (queueKeys.length > 10) {
        console.log(`   ... dan ${queueKeys.length - 10} keys lainnya`);
      }
    } else {
      console.log('   Belum ada jobs dalam queue (normal jika queue kosong)');
    }

    // Get Bull queue stats
    console.log('\n📈 Queue Statistics:');
    const waitingCount = await redis.llen('bull:sinkronisasi-queue:wait');
    const activeCount = await redis.llen('bull:sinkronisasi-queue:active');
    const completedCount = await redis.zcard(
      'bull:sinkronisasi-queue:completed',
    );
    const failedCount = await redis.zcard('bull:sinkronisasi-queue:failed');
    const delayedCount = await redis.zcard('bull:sinkronisasi-queue:delayed');

    console.log(`   Waiting jobs:   ${waitingCount}`);
    console.log(`   Active jobs:    ${activeCount}`);
    console.log(`   Completed jobs: ${completedCount}`);
    console.log(`   Failed jobs:    ${failedCount}`);
    console.log(`   Delayed jobs:   ${delayedCount}`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ REDIS TEST COMPLETED SUCCESSFULLY');
    console.log('='.repeat(60));
    console.log('Status: Redis berfungsi dengan baik!');
    console.log('Bull Queue siap digunakan untuk replikasi async.');
  } catch (error) {
    console.error('\n❌ REDIS CONNECTION FAILED!');
    console.error('='.repeat(60));

    if (error instanceof Error) {
      console.error(`Error Type: ${error.name}`);
      console.error(`Error Message: ${error.message}`);

      if (error.message.includes('ECONNREFUSED')) {
        console.error('\n🔧 SOLUSI:');
        console.error('   Redis server tidak berjalan. Jalankan salah satu:');
        console.error('   1. Jalankan redis-server langsung');
        console.error('   2. Atau gunakan Docker:');
        console.error(
          '      docker run -d -p 6379:6379 --name redis redis:alpine',
        );
      }
    }

    console.error('\n' + '='.repeat(60));
    process.exit(1);
  } finally {
    await redis.quit();
    console.log('\n👋 Koneksi Redis ditutup.');
  }
}

testRedisConnection().catch(console.error);
