// src\packages\shared-web\src\api-service\services\user.service.ts
import {
    CheckEmailResponseType,
    CheckEmailSchemaFormType,
    CreateUserResponseType,
    CreateUserSchemaFormType,
    SetNewPasswordSchemaFormType,
    VerifyEmailSchemaFormType,
} from '@org/schemas/auth';
import { useApiMutation } from '../use-api-mutation';

export const useCheckEmail = () =>
    useApiMutation<CheckEmailResponseType, CheckEmailSchemaFormType>({
        method: 'post',
        endpoint: 'user/check-email',
    });

export const useCreateUser = () =>
    useApiMutation<CreateUserResponseType, CreateUserSchemaFormType>({
        method: 'post',
        endpoint: 'user/create-user',
    });

export const useVerifyEmailOtp = () =>
    useApiMutation<CreateUserResponseType, VerifyEmailSchemaFormType>({
        method: 'post',
        endpoint: 'user/verify-email',
    });

export const useSetNewPassword = () =>
    useApiMutation<CreateUserResponseType, SetNewPasswordSchemaFormType>({
        method: 'post',
        endpoint: 'user/set-new-password',
    });
