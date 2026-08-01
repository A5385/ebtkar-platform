import { HttpException, Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';

import { AUTH_SERVICE } from './auth-client.module';

export interface RegisterInput {
    email: string;
    password: string;
}

export interface RegisterResponse {
    message: string;
}

interface RemoteServiceError {
    statusCode?: number;
    message?: string | string[];
}

@Injectable()
export class AuthMicroserviceClient {
    constructor(
        @Inject(AUTH_SERVICE)
        private readonly authClient: ClientProxy,
    ) {}

    async register(input: RegisterInput): Promise<RegisterResponse> {
        return firstValueFrom(
            this.authClient.send<RegisterResponse, RegisterInput>('auth.register', input).pipe(
                timeout(5_000),

                catchError((error: unknown) => {
                    const remoteError = error as RemoteServiceError;

                    if (remoteError.statusCode) {
                        return throwError(
                            () =>
                                new HttpException(
                                    remoteError.message ?? 'Authentication request failed',
                                    remoteError.statusCode ?? 500,
                                ),
                        );
                    }

                    return throwError(
                        () => new ServiceUnavailableException('Auth Service is unavailable'),
                    );
                }),
            ),
        );
    }
}
