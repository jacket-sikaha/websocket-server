import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  a = Math.random();
  // 守卫传递类/实例区别和管道的例子类似
  onApplicationBootstrap() {
    console.log(`RolesGuard===============.onApplicationBootstrap`);
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('context.getArgs():', this.a);
    return true;
  }
}
