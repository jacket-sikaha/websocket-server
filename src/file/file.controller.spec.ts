import { Test } from '@nestjs/testing';
import { FileController } from './file.controller';
import { EventsGateway } from '@/socket/events.gateway';
import { FileService } from './file.service';
import { projectFolder } from '@/util/utils';
import { readFile } from 'fs/promises';
import { join } from 'path';

describe('FileController', () => {
  let fileController: FileController;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [FileController],
      providers: [EventsGateway, FileService],
    }).compile();

    fileController = moduleRef.get(FileController);
  });

  it('fileController downloadFile', async () => {
    const mockFileData = await readFile(
      join(projectFolder, '1ea7994bb5e5a8b4a6e08b40dd8e0e5c'),
    );

    const res = await fileController.downloadFile({
      fid: '1ea7994bb5e5a8b4a6e08b40dd8e0e5c',
      fileName: 'test.txt',
      userId: '123',
    });
    console.log('data', res);
    expect(res).toEqual(mockFileData);
  });
});
