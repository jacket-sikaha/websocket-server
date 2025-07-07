import { EventsGateway } from '@/socket/events.gateway';
import { Injectable } from '@nestjs/common';

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
