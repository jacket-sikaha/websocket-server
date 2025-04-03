import { Controller, Get, Post } from '@nestjs/common';
import { EventsGateway } from 'src/socket/events.gateway';

@Controller('ocr')
export class OcrController {
  constructor(readonly aaa: EventsGateway) {}
  onApplicationBootstrap() {
    console.log('this.aaa:', 11111111111111);
  }
  @Post('env')
  getENV(): string {
    return JSON.stringify({
      AK: process.env.BDAK,
      SK: process.env.BDSK,
    });
  }
}
