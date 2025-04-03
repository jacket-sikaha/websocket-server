import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import asd from './util';
import { EventsGateway } from './socket/events.gateway';
import { OcrController } from './ocr/ocr.controller';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly aaa: EventsGateway,
    private readonly bbb: OcrController,
  ) {}

  @Get()
  getHello(): string {
    console.log('asd', asd, this.aaa === this.bbb.aaa);
    asd.aa();
    return this.appService.getHello();
  }
}
