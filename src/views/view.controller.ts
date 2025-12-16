import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Response } from 'express';
import * as path from 'path';

/**
 * ViewController - Server-side rendered views untuk UI simulasi
 */
@ApiExcludeController()
@Controller()
export class ViewController {
  @Get()
  index(@Res() res: Response) {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.ejs'));
  }

  @Get('pusat')
  pusat(@Res() res: Response) {
    res.sendFile(path.join(__dirname, '..', 'views', 'pusat.ejs'));
  }

  @Get('cabang')
  cabang(@Res() res: Response) {
    res.sendFile(path.join(__dirname, '..', 'views', 'cabang.ejs'));
  }
}
