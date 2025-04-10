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
import { IDValidationPipe, IDValidationPipe22 } from './validation.pipe';
import { RolesGuard } from './roles.guard';

@Controller('share-file')
// @UseGuards(new RolesGuard())
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('getConnetIDMap')
  test() {
    const map = this.fileService.getConnetIDMap();
    return map;
  }

  @Post('upload')
  @UseGuards(new RolesGuard())
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
    @Body('userId', IDValidationPipe22) userId: string,
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
  @UseGuards(new RolesGuard())
  async downloadFile(
    @Body('userId', IDValidationPipe22) userId: string,
    @Body() { fid, fileName }: DownloadFileDto,
  ) {
    const file = await readFile(join(projectFolder, fid));
    return { file, name: fileName };
  }
}
