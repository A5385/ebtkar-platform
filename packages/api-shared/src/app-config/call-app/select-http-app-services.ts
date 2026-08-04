import type { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import * as express from "express";
import { join } from "path";
import { CorsConfig } from "../config/cors.config";
import type { AppOptions } from "./app-options.type";

export function selectHttpAppService(
  app: NestExpressApplication,
  options: Omit<AppOptions, "isMicroservice">,
  apiPrefix: string,
): void {
  const {
    enableCookie = true,
    enableCors = true,
    enablePrefix = true,
    enableUpload = false,
    uploadFolder = "uploads",
    // enableValidationPipe = true,
    corsOptions = {},
  } = options;

  if (enableCookie) {
    app.use(cookieParser());
  }

  if (enableCors) {
    app.enableCors(CorsConfig(corsOptions));
  }

  // if (enableValidationPipe) {
  //   app.useGlobalPipes(
  //     new ValidationPipe({
  //       whitelist: true,
  //       transform: true,
  //       skipUndefinedProperties: true,
  //       transformOptions: { enableImplicitConversion: true },
  //       exceptionFactory: (validationErrors = []) => {
  //         const formattedErrors = validationErrors
  //           .map((error) => {
  //             const constraints = Object.values(error.constraints || {}).join(
  //               ", ",
  //             );
  //             return `${error.property}: ${constraints}`;
  //           })
  //           .join(", ");

  //         throw new BadRequestException({
  //           message: `Validation failed. Please correct the following: ${formattedErrors}`,
  //         });
  //       },
  //     }),
  //   );
  // }
  if (enableUpload && uploadFolder) {
    const uploadsPath = join(process.cwd(), uploadFolder);

    app.use(
      `/${apiPrefix}/${uploadFolder}`,
      express.static(uploadsPath, {
        index: false,
        fallthrough: false,
        redirect: false,
      }),
    );
  }
  if (enablePrefix && apiPrefix) {
    app.setGlobalPrefix(apiPrefix);
  }
}
