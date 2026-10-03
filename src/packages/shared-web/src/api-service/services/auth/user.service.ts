// src\packages\shared-web\src\api-service\services\user.service.ts
import {
    CheckEmailSchemaFormType,
    CreateUserSchemaFormType,
    DefaultUserMutationResponse,
    SetNewPasswordSchemaFormType,
    VerifyEmailSchemaFormType,
} from '@org/schemas/auth';
import { useApiMutation } from '../../use-api-mutation';

export const useCheckEmail = () =>
    useApiMutation<DefaultUserMutationResponse, CheckEmailSchemaFormType>({
        method: 'post',
        endpoint: 'user/check-email',
    });

export const useCreateUser = () =>
    useApiMutation<DefaultUserMutationResponse, CreateUserSchemaFormType>({
        method: 'post',
        endpoint: 'user/create-user',
    });

export const useVerifyEmailOtp = () =>
    useApiMutation<DefaultUserMutationResponse, VerifyEmailSchemaFormType>({
        method: 'post',
        endpoint: 'user/verify-email',
    });

export const useSetNewPassword = () =>
    useApiMutation<DefaultUserMutationResponse, SetNewPasswordSchemaFormType>({
        method: 'post',
        endpoint: 'user/set-new-password',
    });
