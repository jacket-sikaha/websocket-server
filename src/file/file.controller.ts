import {
  Body,
  Controller,
  Get,
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
import { FileService } from './file.service';

@Controller('share-file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('getConnetIDMap')
  test() {
    const map = this.fileService.getConnetIDMap();
    return map;
  }

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
    @Body('userId') userId: string,
  ) {
    console.log(file, userId);
    if (!this.fileService.verifyUserId(userId)) {
      return {
        message: 'UserId is not valid',
      };
    }
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
  async downloadFile(@Body() { fid, fileName, userId }: DownloadFileDto) {
    if (!this.fileService.verifyUserId(userId)) {
      return {
        message: 'UserId is not valid',
      };
    }
    const file = await readFile(join(projectFolder, fid));
    return { file, name: fileName };
  }
}
