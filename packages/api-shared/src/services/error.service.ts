//packages\api-shared\src\services\error-service\error.service.ts
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { WinstonLoggerService } from "./logger.service";

@Injectable()
export class ErrorService {
  constructor(private readonly logger: WinstonLoggerService) {}

  throwException(
    moduleName: string,
    statusCode: number,
    message: string | string[],
    error?: unknown,
  ): never {
    const msg = typeof message === "string" ? message : message.join(",");

    this.logger.error(msg, moduleName);
    throw new RpcException({
      success: false,
      statusCode,
      timestamp: new Date().toISOString(),
      error: {
        message: msg,
        error,
      },
    });
  }

  badRequest(message: string, moduleName: string): never {
    return this.throwException(moduleName, 400, message);
  }

  unauthorized(message: string, moduleName: string): never {
    return this.throwException(moduleName, 401, message);
  }

  forbidden(message: string, moduleName: string): never {
    return this.throwException(moduleName, 403, message);
  }

  notFound(message: string, moduleName: string): never {
    return this.throwException(moduleName, 404, message);
  }

  conflict(message: string, moduleName: string): never {
    return this.throwException(moduleName, 409, message);
  }

  internalServerError(
    message = "Internal server error.",
    moduleName: string,
  ): never {
    return this.throwException(moduleName, 500, message);
  }

  serviceUnavailable(
    message = "Service unavailable.",
    moduleName: string,
  ): never {
    return this.throwException(moduleName, 503, message);
  }
}
