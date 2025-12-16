import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

/**
 * PrismaCabangService - Layanan Prisma untuk database Cabang (Bondowoso)
 * Menggunakan DATABASE_CABANG_URL untuk koneksi
 */
@Injectable()
export class PrismaCabangService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private configService: ConfigService) {
    const url = configService.get<string>('DATABASE_CABANG_URL');
    super({
      datasources: {
        db: {
          url: url,
        },
      },
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database Cabang (Bondowoso) connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 Database Cabang disconnected');
  }
}
