import { CreateOriginFormType, Origin, UpdateOriginFormType } from '@org/schemas/admin';
import { useApiMutation } from '../../use-api-mutation';
import { useApiQuery } from '../../use-api-query';

export const originKeys = {
    getAll: 'GET_ALL_ORIGIN',
};

export const useGetAllOrigins = () => {
    return useApiQuery<Origin[]>({
        endpoint: 'admin-origin/get-all-origins',
        queryKey: [originKeys.getAll],
    });
};
export const useCreateOrigin = () => {
    return useApiMutation<Origin, CreateOriginFormType>({
        endpoint: 'admin-origin/create-origin',
        method: 'post',
        queryKeys: [[originKeys.getAll]],
    });
};
export const useUpdateOrigin = () => {
    return useApiMutation<Origin, UpdateOriginFormType>({
        endpoint: 'admin-origin/update-origin',
        method: 'patch',
        queryKeys: [[originKeys.getAll]],
    });
};
// export const useDeleteOrigin = () => {
//     return useApiMutation({
//         endpoint: 'admin-origin/delete-origin',
//         method: 'delete',
//         queryKeys: [[originKeys.getAll]],
//     });
// };
