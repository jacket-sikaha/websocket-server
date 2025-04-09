import { Injectable } from '@nestjs/common';
import { EventsGateway } from 'src/socket/events.gateway';

@Injectable()
export class FileService {
  constructor(private readonly eventsGateway: EventsGateway) {}

  getConnetIDMap() {
    return [...this.eventsGateway.server.sockets.sockets.keys()];
  }

  verifyUserId(userId: string) {
    const map = new Set(this.getConnetIDMap());
    return map.has(userId);
  }
}
