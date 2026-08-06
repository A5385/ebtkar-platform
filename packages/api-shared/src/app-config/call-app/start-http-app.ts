import { ConsoleLogger, Logger } from "@nestjs/common";
import { NestFactory, type IEntryNestModule } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import type { AppOptions } from "./app-options.type";
import { env, normalizePrefix, parsePort } from "./app.utils";
import { selectHttpAppService } from "./select-http-app-services";

export async function startHttpApplication(
  AppModule: IEntryNestModule,
  options: AppOptions,
) {
  const port = parsePort(env.PORT, "PORT");
  const prefix = normalizePrefix(env.SERVER_PREFIX ?? "api");

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger({}),
  });
  // console.log("🚀 >  startHttpApplication >  app:", app);

  selectHttpAppService(app, options, prefix);

  await app.listen(port);

  const baseUrl = await app.getUrl();

  const applicationUrl =
    options.enablePrefix !== false && prefix ? `${baseUrl}/${prefix}` : baseUrl;

  Logger.log(`🚀 HTTP application is running on: ${applicationUrl}`);
}
