import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { EventsModule } from '@/socket/events.module';

@Module({
  imports: [EventsModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
