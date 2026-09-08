import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ApiResponseType } from '@org/types';

import {
    HandleApiResponseType,
    PrismaKnownRequestErrorLike,
    successCodeMapper,
} from './response-helper.types.js';

import {
    isPrismaInitializationError,
    isPrismaKnownRequestError,
    isPrismaValidationError,
} from './prisma-error.utils.js';

@Injectable()
export class ResponseHelperService {
    createResponse<T>({
        timestamp = new Date().toISOString(),
        ...props
    }: ApiResponseType<T>): ApiResponseType<T> {
        return { timestamp, ...props };
    }

    async handle<T>({
        method,
        successMessage,
        errorMessage,
        fn,
        logger,
    }: HandleApiResponseType<T>): Promise<ApiResponseType<T>> {
        try {
            const data = await fn();

            logger.log(
                successMessage ?? `Operation ${method} completed successfully.`,
                ResponseHelperService.name,
            );
            return this.createResponse({
                success: true,
                statusCode: successCodeMapper[method],

                message: successMessage,
                data,
            });
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }
            logger.error(
                errorMessage ?? `Operation ${method} failed.`,
                ResponseHelperService.name,
                JSON.stringify(error, null, 2),
            );
            throw new RpcException(this.handleError<T>(error, errorMessage));
        }
    }

    handleError<T>(error: unknown, customMessage?: string): ApiResponseType<T> {
        if (isPrismaKnownRequestError(error)) {
            return this.handleKnownPrismaError<T>(error, customMessage);
        }

        if (isPrismaValidationError(error)) {
            return this.createError<T>(
                HttpStatus.BAD_REQUEST,
                customMessage ?? 'invalid_database_input',
                {
                    type: error.name,
                },
            );
        }

        if (isPrismaInitializationError(error)) {
            return this.createError<T>(
                HttpStatus.SERVICE_UNAVAILABLE,
                customMessage ?? 'database_service_unavailable',
                {
                    type: error.name,
                    errorCode: error.errorCode,
                    retryable: error.retryable,
                },
            );
        }

        return this.createError<T>(
            HttpStatus.INTERNAL_SERVER_ERROR,
            customMessage ?? 'unknown_error_occurred_while_processing_your_request',
            {
                type: error instanceof Error ? error.name : 'UnknownError',
            },
        );
    }

    private handleKnownPrismaError<T>(
        error: PrismaKnownRequestErrorLike,
        customMessage?: string,
    ): ApiResponseType<T> {
        switch (error.code) {
            case 'P2002':
                return this.createError<T>(
                    HttpStatus.CONFLICT,
                    customMessage ?? 'record_already_exists',
                    {
                        code: error.code,
                        target: error.meta?.target,
                    },
                );

            case 'P2025':
                return this.createError<T>(
                    HttpStatus.NOT_FOUND,
                    customMessage ?? 'record_not_found',
                    {
                        code: error.code,
                    },
                );

            case 'P2003':
                return this.createError<T>(
                    HttpStatus.CONFLICT,
                    customMessage ?? 'record_is_referenced_by_another_record',
                    {
                        code: error.code,
                        field: error.meta?.field_name,
                    },
                );

            case 'P2024':
                return this.createError<T>(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    customMessage ?? 'database_request_timeout',
                    {
                        code: error.code,
                    },
                );

            case 'P2000':
            case 'P2005':
            case 'P2006':
            case 'P2007':
            case 'P2011':
            case 'P2012':
            case 'P2013':
            case 'P2016':
            case 'P2019':
                return this.createError<T>(
                    HttpStatus.BAD_REQUEST,
                    customMessage ?? 'invalid_database_input',
                    {
                        code: error.code,
                    },
                );

            default:
                return this.createError<T>(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    customMessage ?? 'database_operation_failed',
                    {
                        code: error.code,
                    },
                );
        }
    }

    private createError<T>(
        statusCode: HttpStatus,
        message: string,
        error?: unknown,
    ): ApiResponseType<T> {
        return this.createResponse({
            success: false,
            timestamp: new Date().toISOString(),
            statusCode,
            errors: {
                message,
                error,
            },
        });
    }
}
