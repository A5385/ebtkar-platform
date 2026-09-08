import {
    PrismaInitializationErrorLike,
    PrismaKnownRequestErrorLike,
    PrismaValidationErrorLike,
    UnknownRecord,
} from './response-helper.types.js';

const isObject = (value: unknown): value is UnknownRecord => {
    return typeof value === 'object' && value !== null;
};

const hasPrismaClientVersion = (error: UnknownRecord): boolean => {
    return typeof error.clientVersion === 'string';
};

export const isPrismaKnownRequestError = (error: unknown): error is PrismaKnownRequestErrorLike => {
    if (!isObject(error)) {
        return false;
    }

    return (
        typeof error.code === 'string' &&
        /^P\d{4}$/.test(error.code) &&
        hasPrismaClientVersion(error)
    );
};

export const isPrismaValidationError = (error: unknown): error is PrismaValidationErrorLike => {
    if (!isObject(error)) {
        return false;
    }

    return error.name === 'PrismaClientValidationError' && hasPrismaClientVersion(error);
};

export const isPrismaInitializationError = (
    error: unknown,
): error is PrismaInitializationErrorLike => {
    if (!isObject(error)) {
        return false;
    }

    return error.name === 'PrismaClientInitializationError' && hasPrismaClientVersion(error);
};
