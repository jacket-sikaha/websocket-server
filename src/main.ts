import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SocketIoAdapter } from './socket/SocketIoAdapter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });
  const configService = app.get(ConfigService);
  app.useWebSocketAdapter(new SocketIoAdapter(app, configService));
  app.useGlobalInterceptors(new TransformInterceptor());
  console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
  await app.listen(3000, () => {
    console.log('welcome to http://localhost:3000');
  });
}
bootstrap();
