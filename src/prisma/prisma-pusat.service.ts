import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

/**
 * PrismaPusatService - Layanan Prisma untuk database Pusat (Jember)
 * Menggunakan DATABASE_PUSAT_URL untuk koneksi
 */
@Injectable()
export class PrismaPusatService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private configService: ConfigService) {
    const url =
      configService.get<string>('DATABASE_PUSAT_URL') ||
      configService.get<string>('DATABASE_URL');
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
    console.log('✅ Database Pusat (Jember) connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 Database Pusat disconnected');
  }
}
