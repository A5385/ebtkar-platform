//packages\api-shared\src\services\error-service\error.service.ts
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class ErrorService {
  throwException(
    statusCode: number,
    message: string | string[],
    error?: unknown,
  ): never {
    throw new RpcException({
      success: false,
      statusCode,
      timestamp: new Date().toISOString(),
      error: {
        message: typeof message === "string" ? message : message.join(","),
        error,
      },
    });
  }

  badRequest(message: string): never {
    return this.throwException(400, message);
  }

  unauthorized(message: string): never {
    return this.throwException(401, message);
  }

  forbidden(message: string): never {
    return this.throwException(403, message);
  }

  notFound(message: string): never {
    return this.throwException(404, message);
  }

  conflict(message: string): never {
    return this.throwException(409, message);
  }

  internalServerError(message = "Internal server error."): never {
    return this.throwException(500, message);
  }

  serviceUnavailable(message = "Service unavailable."): never {
    return this.throwException(503, message);
  }
}
