// packages\types\src\response.type.ts
type common = {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path?: string;
};

export type ApiSuccessResponse<T extends unknown = unknown> = common & {
  message?: string;
  payload?: T;
};

export type ApiErrorResponse = common & {
  error?: {
    message?: string;
    error?: string;
  };
};

export type ResponseType<T extends unknown = unknown> = ApiSuccessResponse<T> &
  ApiErrorResponse;

export type MethodType =
  "create" | "get-all" | "find-by" | "find-by-id" | "update" | "delete";

export type LocaleType = "ar" | "en";
export type MessageType = "success" | "error";
