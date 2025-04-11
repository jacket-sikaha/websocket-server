import {
  Body,
  Controller,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { projectFolder } from 'src/util/utils';
import { DownloadFileDto } from './download-file.dto';
import { FileService } from './file.service';
import { RolesGuard } from './roles.guard';
import { IDValidationPipe } from './validation.pipe';
import { LoggingInterceptor } from './logging.interceptor';

@Controller('share-file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('getConnetIDMap')
  test() {
    const map = this.fileService.getConnetIDMap();
    return map;
  }

  @Post('upload')
  // 处理 multipart/form-data 请求时，守卫获取body 参数为 undefined 的根本原因
  // multipart/form-data 需要 multer 中间件解析，若守卫（Guard）在 multer 前执行，则无法获取已解析的 body
  // @UseGuards(RolesGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      dest: projectFolder,
    }),
    LoggingInterceptor,
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
    @Body('userId', IDValidationPipe) userId: string,
  ) {
    console.log(file, userId);
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
  @UseGuards(RolesGuard) // 采用守卫进行校验
  async downloadFile(
    // @Body('userId', IDValidationPipe) userId: string,
    @Body() { fid, fileName }: DownloadFileDto,
  ) {
    const file = await readFile(join(projectFolder, fid));
    return { file, name: fileName };
  }
}
