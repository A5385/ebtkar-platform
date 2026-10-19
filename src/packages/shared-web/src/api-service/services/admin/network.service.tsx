import { NetworkSettingsFormType } from '@org/schemas/admin';
import { NetworkSettings } from '@org/schemas/admin/schema';
import { useApiMutation } from '../../use-api-mutation';
import { useApiQuery } from '../../use-api-query';

export const networkKeys = {
    get: 'GET_NETWORK_SETTINGS',
};

export const useGetNetwork = () => {
    return useApiQuery<NetworkSettings>({
        endpoint: 'admin-network/get-network',
        queryKey: [networkKeys.get],
    });
};

export const useUpdateNetwork = () => {
    return useApiMutation<NetworkSettings, NetworkSettingsFormType>({
        endpoint: 'admin-network/update-network',
        method: 'patch',
        queryKeys: [[networkKeys.get]],
    });
};
