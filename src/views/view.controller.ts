import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Response } from 'express';

/**
 * ViewController - Server-side rendered views untuk UI simulasi
 */
@ApiExcludeController()
@Controller()
export class ViewController {
  @Get()
  index(@Res() res: Response) {
    return res.render('index', {});
  }

  @Get('pusat')
  pusat(@Res() res: Response) {
    return res.render('pusat', {});
  }

  @Get('cabang')
  cabang(@Res() res: Response) {
    return res.render('cabang', {});
  }
}
