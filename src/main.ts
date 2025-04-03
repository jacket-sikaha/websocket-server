import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });
  console.log({
    AK: process.env.BDAK,
    SK: process.env.BDSK,
  });
  // const io = new Server(3000, {
  //   cors: {
  //     origin: ['https://admin.socket.io'],
  //     credentials: true,
  //   },
  //   maxHttpBufferSize: 5 * 1e8, // 500M
  //   // pingTimeout: 30000,
  // });

  await app.listen(3000, () => {
    console.log('welcome to http://localhost:3000');
  });
}
bootstrap();
