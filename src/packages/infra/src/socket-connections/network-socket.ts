// src\packages\infra\src\socket-connections\network-socket.ts
import { createSocketClient } from '../socket-client.js';

export const NETWORK_SETTINGS_UPDATED = 'network-settings.updated';

export const connectNetworkSettingsSocket = ({
    url,
    listener,
}: {
    url: string;
    listener: () => void;
}): (() => void) =>
    createSocketClient({
        url,
        event: NETWORK_SETTINGS_UPDATED,
        listener,
    });
