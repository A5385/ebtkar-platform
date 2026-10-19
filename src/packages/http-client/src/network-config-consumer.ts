// src\packages\http-client\src\network-config-consumer.ts
import { EVENT_PATTERN } from '@org/constants';
import { startKafkaConsumer } from '@org/infra';
import { invalidateNetworkConfig } from './get-network-config.js';

let consumerPromise: ReturnType<typeof startKafkaConsumer> | undefined;

export const startNetworkConfigConsumer = async (): Promise<void> => {
    if (consumerPromise) {
        await consumerPromise;
        return;
    }

    consumerPromise = startKafkaConsumer({
        groupId: 'http-client',
        topic: EVENT_PATTERN.admin.configUpdated,
        onMessage: async ({ message }) => {
            if (!message) {
                return;
            }

            invalidateNetworkConfig();
        },
    });

    try {
        await consumerPromise;
    } catch (error) {
        consumerPromise = undefined;
        throw error;
    }
};
