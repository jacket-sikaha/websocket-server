enum ChatMsgType {
  str = 0,
  file,
  other = 2,
}

export class MessageBodyDto {
  type: number;
  str?: string;
  file?: Express.Multer.File[];
  from: string;
  source?: boolean; // 消息来源 ： 1 是发送者 / 0 接收者
}
