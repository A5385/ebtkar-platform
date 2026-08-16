import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { ApiErrorResponse } from '@repo/types';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        const resJson: ApiErrorResponse & { timestamp: string; path: string } = {
            success: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: {
                message: exception?.message,
                error: JSON.stringify(exception, null, 2),
            },
        };

        Logger.error(JSON.stringify(resJson, null, 2));
        response.status(status).json(resJson);
    }
}
