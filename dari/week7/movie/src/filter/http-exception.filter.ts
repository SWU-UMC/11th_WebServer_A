import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiException } from '../exception/api.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();
    const body = exception.getResponse();

    const message =
      typeof body === 'string'
        ? body
        : (body as { message: string | string[] }).message;

    response.status(status).json({
      isSuccess: false,
      code:
        exception instanceof ApiException
          ? exception.code
          : `COMMON${status}`,
      message: Array.isArray(message) ? message[0] : message,
      result: null,
    });
  }
}