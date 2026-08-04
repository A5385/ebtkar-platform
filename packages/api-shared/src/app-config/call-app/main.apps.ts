import { type IEntryNestModule } from "@nestjs/core";
import type { AppOptions } from "./app-options.type";
import { startHttpApplication } from "./start-http-app";
import { startMicroservice } from "./start-microservice-app";

export async function generateMainConfig(
  AppModule: IEntryNestModule,
  { isMicroservice = true, ...options }: AppOptions = {},
) {
  if (isMicroservice) {
    return await startMicroservice(AppModule);
  } else {
    return await startHttpApplication(AppModule, options);
  }
}
