import {
    CheckEmailResponseType,
    CheckEmailSchemaFormType,
    CreateUserResponseType,
    CreateUserSchemaFormType,
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
