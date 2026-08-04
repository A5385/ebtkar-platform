import { Logger } from "@nestjs/common";
import type { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import * as dotenv from "dotenv";
dotenv.config();

const customOrigin: CorsOptions["origin"] = (origin, callback) => {
  const allowedOrigins = new Set<string>(
    process.env.ALLOWED_ORIGINS?.split(",") || [],
  );

  if (!origin) {
    Logger.debug("Request without Origin header allowed");
    return callback(null, true);
  }

  if (allowedOrigins.has("*")) {
    Logger.warn(
      `You have enabled CORS for all origins. This is not recommended for production environments.`,
    );
    return callback(null, true);
  }
  if (allowedOrigins.has(origin)) {
    Logger.log(`CORS enabled Successfully for origin.`);
    return callback(null, true);
  }

  Logger.error(`CORS blocked for origin: ${origin}`);
  return callback(new Error(`CORS blocked for origin: ${origin}`), false);
};

const customMethods: CorsOptions["methods"] = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "HEAD",
  "DELETE",
  "OPTIONS",
];

const customAllowedHeaders: CorsOptions["allowedHeaders"] = [
  "Accept",
  "Authorization",
  "Content-Type",
  "X-Requested-With",
  "X-From-Mobile-App",
];

export const CorsConfig = ({
  origin = customOrigin,
  credentials = true,
  methods = customMethods,
  allowedHeaders = customAllowedHeaders,
  ...otherOptions
}: CorsOptions): CorsOptions => {
  return {
    origin,
    credentials,
    methods,
    allowedHeaders,
    ...otherOptions,
  };
};
