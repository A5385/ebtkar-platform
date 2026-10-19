// src\packages\shared-web\src\api-service\services\admin\origin.service.tsx
import { QueryParamsType } from '@org/http-client';
import type {
    CreateOriginFormType,
    CreateOriginType,
    UpdateOriginFormType,
    UpdateOriginType,
} from '@org/schemas/admin';
import { Origin } from '@org/schemas/admin/schema';
import { useApiMutation } from '../../use-api-mutation';
import { useApiQuery } from '../../use-api-query';

export const originKeys = {
    getAll: 'GET_ALL_ORIGIN',
};

export const useGetAllOrigins = (queryParams: QueryParamsType) => {
    // console.log('A useGetAllOrigins', queryParams);
    return useApiQuery<Origin[]>({
        endpoint: 'admin-origin/get-all-origins',
        queryKey: [originKeys.getAll],
        queryParams,
    });
};
export const useCreateOrigin = () => {
    return useApiMutation<CreateOriginType, CreateOriginFormType>({
        endpoint: 'admin-origin/create-origin',
        method: 'post',
        queryKeys: [[originKeys.getAll]],
    });
};
export const useUpdateOrigin = () => {
    return useApiMutation<UpdateOriginType, UpdateOriginFormType>({
        endpoint: 'admin-origin/update-origin',
        method: 'patch',
        queryKeys: [[originKeys.getAll]],
    });
};
export const useDeleteOrigin = () => {
    return useApiMutation<void, { id: string }>({
        endpoint: `admin-origin/delete-origin`,
        method: 'delete',
        queryKeys: [[originKeys.getAll]],
    });
};
