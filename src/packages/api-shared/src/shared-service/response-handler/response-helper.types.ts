import { HttpStatus } from '@nestjs/common';
import { WinstonLoggerService } from '../logger/logger.service.js';

export type UnknownRecord = Record<string, unknown>;

export type ApiMethodType =
    | 'check'
    | 'verifyOtp'
    | 'logout'
    | 'login'
    | 'create'
    | 'getAll'
    | 'getBy'
    | 'getById'
    | 'update'
    | 'delete';

export type HandleApiResponseType<T> = {
    method: ApiMethodType;
    successMessage?: string;
    errorMessage?: string;
    logger: WinstonLoggerService;
    fn: () => Promise<T>;
};

export type PrismaKnownRequestErrorLike = {
    name?: string;
    message?: string;
    code: string;
    clientVersion: string;
    meta?: UnknownRecord;
    batchRequestIdx?: number;
};

export type PrismaValidationErrorLike = {
    name: 'PrismaClientValidationError';
    message?: string;
    clientVersion: string;
};

export type PrismaInitializationErrorLike = {
    name: 'PrismaClientInitializationError';
    message?: string;
    clientVersion: string;
    errorCode?: string;
    retryable?: boolean;
};

export const successCodeMapper: Record<ApiMethodType, HttpStatus> = {
    check: HttpStatus.OK,
    verifyOtp: HttpStatus.OK,
    create: HttpStatus.CREATED,
    login: HttpStatus.OK,
    logout: HttpStatus.OK,
    getAll: HttpStatus.OK,
    getBy: HttpStatus.OK,
    getById: HttpStatus.OK,
    update: HttpStatus.OK,
    delete: HttpStatus.OK,
};
