import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './socket/events.module';
import { OcrModule } from './ocr/ocr.module';
import { EventsGateway } from './socket/events.gateway';

@Module({
  // 激活作业调度
  // 所需要加载的module全部都要在根模块进行加载
  imports: [
    ConfigModule.forRoot(),
    // ScheduleModule.forRoot(),
    // CronModule,
    OcrModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
