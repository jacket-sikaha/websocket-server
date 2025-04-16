enum ChatMsgTyoe {
  str = 0,
  file,
  other = 2,
}

export class MessageBodyDto {
  type: ChatMsgTyoe;
  str?: string;
  file?: Express.Multer.File[];
  from: string;
}
