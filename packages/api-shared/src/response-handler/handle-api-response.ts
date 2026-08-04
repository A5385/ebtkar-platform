// packages\api-shared\src\response-handler\handle-api-response.ts
import { Logger } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import {
  AuthPrisma,
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@repo/auth-database";
import type { ResponseType } from "@repo/types";
import { ErrorService } from "../services";
import { GenerateApiResponse } from "./generate-response";
import { generateMessage, getErrorMessage } from "./message-generator";
import type { GenerateMessageProps } from "./type";

export interface HandleApiResponseProps<T> extends GenerateMessageProps {
  fn: () => Promise<T>;
}

interface NormalizedError {
  statusCode: number;
  message: string | string[];
  error: string | string[];
}

const errorService = new ErrorService();

export async function handleApiResponse<T>({
  fn,
  locale = "en",
  statusCode,
  method,
  moduleName,
  id,
  getBy,
}: HandleApiResponseProps<T>): Promise<ResponseType<T> | undefined> {
  const logMsgProps: GenerateMessageProps = {
    locale: "en",
    getBy,
    id,
    method,
    moduleName,
  };
  const responseMsgProps: GenerateMessageProps = {
    locale,
    method,
    moduleName,
  };

  try {
    const payload = await fn();
    if (payload) {
      Logger.log(
        generateMessage({ type: "success", ...logMsgProps }),
        "HandleApiResponse",
      );

      return GenerateApiResponse({
        success: true,
        timestamp: new Date().toISOString(),
        path: moduleName,
        statusCode: statusCode ? statusCode : method === "create" ? 201 : 200,
        message: generateMessage({ type: "success", ...responseMsgProps }),
        payload,
      });
    }
  } catch (caughtError: unknown) {
    const normalizedError = getError(
      caughtError,
      generateMessage({ type: "error", ...logMsgProps }),
    );

    Logger.error(
      generateMessage({ type: "error", ...logMsgProps }),
      "HandleApiResponse",
    );
    return errorService.throwException(
      normalizedError.statusCode,
      normalizedError.message,
    );
  }
}

function getError(
  err: unknown,
  fallbackMessage = "An unknown error occurred while processing your request.",
): NormalizedError {
  /*
   * Existing RpcException
   */
  if (err instanceof RpcException) {
    return getRpcError(err, fallbackMessage);
  }

  /*
   * Known Prisma errors:
   * P2002, P2003, P2025, etc.
   */
  if (err instanceof PrismaClientKnownRequestError) {
    return getKnownPrismaError(err);
  }

  /*
   * Invalid Prisma query/data.
   */
  if (err instanceof PrismaClientValidationError) {
    return {
      statusCode: 400,
      message: "Invalid database request.",
      error: err.message,
    };
  }

  /*
   * Database connection or startup problem.
   */
  if (err instanceof PrismaClientInitializationError) {
    return {
      statusCode: 503,
      message: "Database service is unavailable.",
      error: err.message,
    };
  }

  /*
   * Normal JavaScript error.
   */
  if (err instanceof Error) {
    return {
      statusCode: 500,
      message: fallbackMessage,
      error: err.message,
    };
  }

  /*
   * Unknown value thrown.
   */
  return {
    statusCode: 500,
    message: fallbackMessage,
    error: getErrorMessage(err),
  };
}

function getRpcError(
  err: RpcException,
  fallbackMessage: string,
): NormalizedError {
  const rpcError = err.getError();

  if (typeof rpcError === "string") {
    return {
      statusCode: 500,
      message: rpcError,
      error: rpcError,
    };
  }

  if (typeof rpcError === "object" && rpcError !== null) {
    const value = rpcError as {
      statusCode?: number;
      message?: string | string[];
      error?:
        | string
        | string[]
        | {
            message?: string | string[];
            error?: string | string[];
          };
    };

    let errorDetails: string | string[] = err.message;
    let nestedMessage: string | string[] | undefined;

    if (typeof value.error === "string") {
      errorDetails = value.error;
    } else if (Array.isArray(value.error)) {
      errorDetails = value.error;
    } else if (typeof value.error === "object" && value.error !== null) {
      errorDetails = value.error.error ?? value.error.message ?? err.message;
      nestedMessage = value.error.message;
    }

    return {
      statusCode: value.statusCode ?? 500,
      message: value.message ?? nestedMessage ?? fallbackMessage,
      error: errorDetails,
    };
  }

  return {
    statusCode: 500,
    message: fallbackMessage,
    error: err.message,
  };
}

function getKnownPrismaError(
  err: AuthPrisma.PrismaClientKnownRequestError,
): NormalizedError {
  switch (err.code) {
    case "P2000":
      return {
        statusCode: 400,
        message: "The provided value is too long.",
        error: err.message,
      };

    case "P2002":
      return {
        statusCode: 409,
        message: getUniqueConstraintMessage(err),
        error: err.code,
      };

    case "P2003":
      return {
        statusCode: 409,
        message: "A related record constraint was violated.",
        error: err.code,
      };

    case "P2014":
      return {
        statusCode: 409,
        message: "The requested operation violates a required relation.",
        error: err.code,
      };

    case "P2025":
      return {
        statusCode: 404,
        message: "The requested record was not found.",
        error: err.code,
      };

    default:
      return {
        statusCode: 500,
        message: "A database operation failed.",
        error: err.code,
      };
  }
}

function getUniqueConstraintMessage(
  err: AuthPrisma.PrismaClientKnownRequestError,
): string {
  const target = err.meta?.target;

  if (Array.isArray(target) && target.length > 0) {
    return `A record with the same ${target.join(", ")} already exists.`;
  }

  if (typeof target === "string") {
    return `A record with the same ${target} already exists.`;
  }

  return "A record with the same unique value already exists.";
}
