import { Global, Module } from "@nestjs/common";
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from "nest-winston";
import * as winston from "winston";
import { AppConfig } from "../app-config";
import { EnvConfigService } from "./env-config.service";
import { ErrorService } from "./error.service";
import { WinstonLoggerService } from "./logger.service";
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(AppConfig.name, {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
  ],
  providers: [EnvConfigService, WinstonLoggerService, ErrorService],
  exports: [EnvConfigService, WinstonLoggerService, ErrorService],
})
export class SharedModule {}
