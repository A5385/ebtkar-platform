import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfigService } from './env-config.service';

@Global()
@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true })],
    providers: [EnvConfigService],
    exports: [EnvConfigService],
})
export class EnvConfigModule {}
