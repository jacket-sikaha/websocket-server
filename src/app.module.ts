import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  // 激活作业调度
  // 所需要加载的module全部都要在根模块进行加载
  imports: [
    ConfigModule.forRoot(),
    // ScheduleModule.forRoot(),
    // CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
