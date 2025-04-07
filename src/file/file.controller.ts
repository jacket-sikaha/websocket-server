import {
  Body,
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { projectFolder } from 'src/util/utils';
import { DownloadFileDto } from './download-file.dto';

@Controller('share-file')
export class FileController {
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: projectFolder,
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1e8 }),
          // new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
    return {
      message: 'File uploaded successfully',
      data: {
        id: file.filename,
        fileSize: file.size,
        fileMimetype: file.mimetype,
        fileOriginalName: file.originalname,
      },
    };
  }

  @Post('download')
  async downloadFile(@Body() { fid, fileName }: DownloadFileDto) {
    const file = await readFile(join(projectFolder, fid));
    return { file, name: fileName };
  }
}
