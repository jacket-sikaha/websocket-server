import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { projectFolder } from 'src/util/utils';

@Controller('file')
export class FileController {
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: projectFolder,
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
