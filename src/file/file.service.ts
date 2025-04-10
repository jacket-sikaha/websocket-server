import { Injectable } from '@nestjs/common';
import { EventsGateway } from 'src/socket/events.gateway';

@Injectable()
export class FileService {
  a = Math.random();
  constructor(private readonly eventsGateway: EventsGateway) {}
  onApplicationBootstrap() {
    console.log('FileService onApplicationBootstrap---------');
  }
  getConnetIDMap() {
    return [...this.eventsGateway.server.sockets.sockets.keys()];
  }

  verifyUserId(userId: string) {
    const map = new Set(this.getConnetIDMap());
    return map.has(userId);
  }
}
