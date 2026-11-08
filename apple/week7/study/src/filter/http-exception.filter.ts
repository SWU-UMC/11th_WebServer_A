import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ApiException } from '../exception/api.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();
    const body = exception.getResponse();
    const message = typeof body === 'string' ? body : (body as { message: string | string[] }).message;

    // ApiException이면 우리가 붙인 코드를 그 외에는 6주차와 같은 규칙을 그대로 씁니다
    const code = exception instanceof ApiException ? exception.code : 'COMMON' + status;

    response.status(status).json({
      isSuccess: false,
      code,
      message: Array.isArray(message) ? message[0] : message,
      result: null,
    });
  }
}
