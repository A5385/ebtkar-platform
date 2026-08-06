import { Logger } from "@nestjs/common";
import { type IEntryNestModule } from "@nestjs/core";
import type { AppOptions } from "./app-options.type";
import { startHttpApplication } from "./start-http-app";
import { startMicroservice } from "./start-microservice-app";

export async function startBootStrap(
  AppModule: IEntryNestModule,
  appOptions: AppOptions = {},
) {
  void bootstrap(AppModule, appOptions).catch((error: unknown) => {
    Logger.error(
      "Error: starting the application",
      error instanceof Error ? error.stack : String(error),
    );

    process.exit(1);
  });
}

async function bootstrap(
  AppModule: IEntryNestModule,
  { isMicroservice = true, ...options }: AppOptions = {},
) {
  if (isMicroservice) {
    return await startMicroservice(AppModule);
  } else {
    return await startHttpApplication(AppModule, options);
  }
}
