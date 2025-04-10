import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FileService } from './file.service';

// 管道，守卫依赖注入fileService，发现都遵循单例，可能主要service才需要显示注册位provider

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly fileService: FileService) {
    this.a = Math.random();
  }
  a = Math.random();
  // 守卫传递类/实例区别和管道的例子类似
  onApplicationBootstrap() {
    console.log(`RolesGuard===============.onApplicationBootstrap`);
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('context.getArgs():', this.a);
    console.log('this.fileService.a:', this.fileService.a);
    return true;
  }
}
