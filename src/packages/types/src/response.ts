type SuccessType = true | false;
export type ApiResponseSuccess<T> = {
    success: true;
    statusCode: number;
    timestamp?: string;
    message?: string;
    data: T;
};

export type ApiResponseError = {
    success: false;
    statusCode: number;
    timestamp?: string;
    errors: {
        message: string | string[];
        error?: unknown;
    };
};

export type ApiResponseType<T, S extends SuccessType = SuccessType> = S extends true
    ? ApiResponseSuccess<T>
    : S extends false
      ? ApiResponseError
      : never;

export type EndPointResponseType<T> = Promise<ApiResponseType<T> | undefined>;
