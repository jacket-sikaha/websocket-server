import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { instrument } from '@socket.io/admin-ui';
import dayjs from 'dayjs';
import { openSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { projectFolder } from 'src/util/utils';
import { MessageBodyDto } from './message.dto';
import { isJSON } from 'src/util';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  maxHttpBufferSize: 5 * 1e8, // 500M
  // pingTimeout: 30000,
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  onApplicationBootstrap() {
    console.log(
      `EventsGateway has been onApplicationBootstrap.`,
      dayjs().format(),
    );
    instrument(this.server, {
      auth: {
        type: 'basic',
        username: 'admin',
        password: 'admin',
      },
    });
  }

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  @SubscribeMessage('msg')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    console.log('data:', data, client.id);
    // client.emit('ack', {
    //   data: `Processed: ${data}`,
    // });
    // 发给除当前socket以外的所有socket
    client.broadcast.emit('msg', data);
    // 这里return 就只会原路发回给发送方的socket
    const res: MessageBodyDto = isJSON(data)
      ? Object.assign(JSON.parse(data), { source: 1 })
      : {
          data,
          source: 1,
        };
    return {
      event: 'msg',
      data: res,
    };
  }

  @SubscribeMessage('totalCount')
  totalCount() {
    return {
      event: 'totalCount',
      data: this.server.engine.clientsCount,
    };
  }

  @SubscribeMessage('countInNamespace')
  countInNamespace(@MessageBody() namespace: string) {
    return {
      event: 'countInNamespace',
      data: this.server.of(namespace).sockets.size,
    };
  }

  @SubscribeMessage('upload')
  async uploadFile(@MessageBody() file: any): Promise<any> {
    const { name, size, type, data } = file;
    try {
      openSync(projectFolder, 'r');
    } catch (error) {
      // @ts-ignore
      if (error?.code === 'ENOENT') {
        const dirCreation = await mkdir(projectFolder, { recursive: true });
      } else {
        console.error('openSync error');
        return;
      }
    }
    try {
      let uuid = Date.now();
      await writeFile(join(projectFolder, `${uuid}-${name}`), data);
      //  cb函数只能发送的客户端能接收并执行，其他客户端没有响应
      // io.emit('upload', {
      //   name: `${uuid}-${name}`,
      //   originName: name,
      //   size,
      //   type,
      //   uuid,
      // });
    } catch (error) {
      return { message: error };
    }
  }

  @SubscribeMessage('download')
  async downloadFile(@MessageBody() data: any): Promise<any> {
    const file = await readFile(join(projectFolder, data?.name));
    return { file, name: data?.originName };
  }
}
