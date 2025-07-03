import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FileService } from './file.service';

// 守卫更适合做权限校验
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly fileService: FileService) {}
  onApplicationBootstrap() {
    console.log(`RolesGuard =============== onApplicationBootstrap`);
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    console.log('守卫获取请求参数:', request.body);
    const { userId } = context.switchToHttp().getRequest().body;
    if (!userId) return false;
    if (userId && !this.fileService.verifyUserId(userId)) {
      return false;
    }
    return true;
  }
}
