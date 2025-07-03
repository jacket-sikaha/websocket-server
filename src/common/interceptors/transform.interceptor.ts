import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  StreamableFile,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface CommonResponse<T> {
  data: T;
  success: boolean;
  message: string;
  code?: number;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, CommonResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CommonResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // 对Buffer / StreamableFile类型不进行包装，交给NestJS原生处理
        // 简化结构检查，匹配序列化后的StreamableFile特征
        if (
          data instanceof Buffer ||
          data instanceof StreamableFile ||
          (data &&
            typeof data === 'object' &&
            'stream' in data &&
            'options' in data)
        ) {
          return data;
        }
        return {
          success: true,
          data,
          message: 'Success',
        };
      }),
      catchError((error) => {
        const status =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        return throwError(() => ({
          success: false,
          data: null,
          message: error.message || 'Internal server error',
          code: status,
        }));
      }),
    );
  }
}
