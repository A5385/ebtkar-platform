import { Logger } from "@nestjs/common";
import { NestFactory, type IEntryNestModule } from "@nestjs/core";
import { Transport, type MicroserviceOptions } from "@nestjs/microservices";
import { env, parsePort } from "./app.utils";

const host = env.HOST ?? "127.0.0.1";

export async function startMicroservice(AppModule: IEntryNestModule) {
  const port = parsePort(env.MICROSERVICE_PORT, "MICROSERVICE_PORT");

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: env.MICROSERVICE_HOST ?? host,
        port: port,
      },
    },
  );

  await app.listen();

  Logger.log(`🚀 TCP microservice is running on: ${host}:${port}`);
}
