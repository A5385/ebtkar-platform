export type ApiResponseType<T> = {
    success: boolean;
    statusCode: number;
    message?: string;
    data?: T;
    errors?: {
        message: string | string[];
        error?: unknown;
    };
};
