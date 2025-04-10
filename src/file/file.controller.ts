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

@Controller('share-file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('getConnetIDMap')
  test() {
    const map = this.fileService.getConnetIDMap();
    return map;
  }

  @Post('upload')
  // ？？？ FileInterceptor这个拦截器貌似会影响守卫获取body参数目前只能使用pipe了
  // @UseGuards(RolesGuard)
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
