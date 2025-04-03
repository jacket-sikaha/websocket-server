import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './socket/events.module';
import { OcrModule } from './ocr/ocr.module';
import { EventsGateway } from './socket/events.gateway';
import { AaaModule } from './aaa/aaa.module';
import { FileModule } from './file/file.module';

@Module({
  // 激活作业调度
  // 所需要加载的module全部都要在根模块进行加载
  imports: [
    ConfigModule.forRoot(),
    // ScheduleModule.forRoot(),
    // CronModule,
    EventsModule,
    AaaModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    //  EventsGateway // 如果不是测试不推荐直接注入服务，会导致单例失效
  ],
})
export class AppModule {}
