// apps/api/gateway/src/interceptors/rpc-to-http.interceptor.ts

import {
    CallHandler,
    ExecutionContext,
    HttpException,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import type { ApiErrorResponse } from '@repo/types';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class RpcToHttpInterceptor implements NestInterceptor {
    intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
        return next.handle().pipe(
            catchError((error: ApiErrorResponse) => {
                return throwError(() => new HttpException(error, error.statusCode ?? 500));
            }),
        );
    }
}
