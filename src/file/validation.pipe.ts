import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { FileService } from './file.service';

// pipe更适合做接口入参数据的校验/处理转换
@Injectable()
export class IDValidationPipe implements PipeTransform {
  // 这种管道依赖注入方式，fileService还是遵顼单例，但IDValidationPipe你使用多少个实例传递配置，就实例化多少个
  constructor(private readonly fileService: FileService) {}
  onApplicationBootstrap() {
    console.log('IDValidationPipe onApplicationBootstrap---------');
  }
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('IDValidationPipe 校验参数:', value);
    if (!this.fileService.verifyUserId(value)) {
      throw new BadRequestException(`UserId(${value}) is not valid`);
    }
    return value;
  }
}
