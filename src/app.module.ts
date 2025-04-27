import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './socket/events.module';
import { OcrModule } from './ocr/ocr.module';
import { EventsGateway } from './socket/events.gateway';
import { FileModule } from './file/file.module';

@Module({
  // 激活作业调度
  // 所需要加载的module全部都要在根模块进行加载
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // ScheduleModule.forRoot(),
    // CronModule,
    EventsModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    //  EventsGateway // 如果不是测试不推荐直接注入服务，会导致单例失效
  ],
})
export class AppModule {}
