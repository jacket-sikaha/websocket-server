import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { FileService } from './file.service';

@Injectable()
export class IDValidationPipe implements PipeTransform {
  // 这种管道依赖注入方式，fileService还是遵顼单例，但IDValidationPipe你使用多少个就实例化多少个
  constructor(private readonly fileService: FileService) {
    this.a = Math.random();
  }

  a: number;
  onApplicationBootstrap() {
    console.log('IDValidationPipe onApplicationBootstrap---------', this.a);
  }
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('value:', value, this.a);
    console.log('this.fileService.a:', this.fileService.a);
    if (!this.fileService.verifyUserId(value)) {
      throw new BadRequestException('UserId is not valid');
    }
    return value;
  }
}
// 传递实例对有注入其他依赖的管道不太适合
// 传递类貌似遵循单例，传递实例则不会
// 传递实例不会执行onApplicationBootstrap
@Injectable()
export class IDValidationPipe22 implements PipeTransform {
  a: number = Math.random();
  onApplicationBootstrap() {
    console.log('2222222222222222 onApplicationBootstrap---------');
  }
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('value2222222:', this.a);
    return value;
  }
}
