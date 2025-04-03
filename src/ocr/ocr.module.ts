import { Module } from '@nestjs/common';
import { OcrController } from './ocr.controller';
import { OcrService } from './ocr.service';
import { EventsGateway } from 'src/socket/events.gateway';

@Module({
  controllers: [OcrController],
  providers: [OcrService, EventsGateway, OcrController],
  exports: [OcrService, OcrController],
})
export class OcrModule {}
