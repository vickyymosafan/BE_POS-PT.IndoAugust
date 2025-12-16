import { Global, Module } from '@nestjs/common';
import { PrismaPusatService } from './prisma-pusat.service';
import { PrismaCabangService } from './prisma-cabang.service';

/**
 * PrismaModule - Modul global untuk dual database
 * Menyediakan PrismaPusatService dan PrismaCabangService
 */
@Global()
@Module({
  providers: [PrismaPusatService, PrismaCabangService],
  exports: [PrismaPusatService, PrismaCabangService],
})
export class PrismaModule {}
