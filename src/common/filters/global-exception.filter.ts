import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * 全局异常过滤器
 * 简化版：只处理特定格式的异常，其他情况返回统一错误格式
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // 默认错误配置
    let errorResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      data: null,
    };

    // 检查是否为全局拦截器抛出的标准格式异常
    if (this.isStandardException(exception)) {
      errorResponse = {
        code: (exception as any).code,
        message: (exception as any).message,
        data: (exception as any).data || null,
      };
    }
    // 处理HttpException（NestJS标准异常）
    else if ((exception as any) instanceof HttpException) {
      const code = (exception as any).getStatus();
      const response = (exception as any).getResponse();
      errorResponse = {
        code,
        message:
          typeof response === 'object'
            ? response.message || response
            : response,
        data: null,
      };
    }
    // 处理字符串异常
    else if (typeof exception === 'string') {
      errorResponse.message = exception;
    }
    // 处理Error实例
    else if (exception instanceof Error) {
      errorResponse.message = exception.message;
    }

    // 输出错误日志
    console.error('GlobalExceptionFilter caught:', {
      type:
        exception instanceof Error
          ? exception.constructor.name
          : typeof exception,
      ...errorResponse,
    });

    // 发送响应
    response.status(errorResponse.code).json(errorResponse);
  }

  /**
   * 检查是否为全局拦截器抛出的标准格式异常
   */
  private isStandardException(exception: unknown): boolean {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      'message' in exception &&
      'data' in exception &&
      'success' in exception
    );
  }
}
