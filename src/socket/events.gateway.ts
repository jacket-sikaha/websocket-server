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

@WebSocketGateway({
  cors: {
    origin: '*',
    // credentials: true,  // 与origin: '*'
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
  handleEvent(
    @MessageBody() data: MessageBodyDto | string,
    @ConnectedSocket() client: Socket,
  ): WsResponse<unknown> {
    console.log('msg---收到客户端数据data:', data, client.id);
    // client.emit('ack', {
    //   data: `Processed: ${data}`,
    // });
    // 发给除当前socket以外的所有socket
    client.broadcast.emit('msg', data);
    // 这里return 就只会原路发回给发送方的socket
    const res =
      typeof data === 'string'
        ? {
            data,
            source: 1,
          }
        : { ...data, source: 1 };
    //  WsResponse<unknown> 的返回格式 只有 socket.on方法的回调才能获取
    //  客户端socket.emit的回调，直接return数据的形式才能触发
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

  @SubscribeMessage('connected-users')
  getConnetIDMap(
    @MessageBody() data: { broadcast: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('connected-users---收到客户端数据data:', data, client.id);
    const res = [...this.server.sockets.sockets.keys()];
    // 发给除当前socket以外的所有socket
    if (data.broadcast) client.broadcast.emit('connected-users', res);
    return res;
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
