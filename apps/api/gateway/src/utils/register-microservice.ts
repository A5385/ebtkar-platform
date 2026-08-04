import { ClientProviderOptions, Transport } from '@nestjs/microservices';

interface RegisterMicroserviceProps {
    name: string | symbol;
    host: string;
    port: number;
}

export function registerMicroservice({
    name,
    host,
    port,
}: RegisterMicroserviceProps): ClientProviderOptions {
    return {
        name,
        transport: Transport.TCP,
        options: {
            host,
            port,
        },
    };
}
