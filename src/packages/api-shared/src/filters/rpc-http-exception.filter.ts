import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { ApiResponseError } from '@org/types';

type HttpResponse = {
    status(code: number): {
        json(body: ApiResponseError): unknown;
    };
};

type ErrorRecord = Record<string, unknown>;

type HttpExceptionLike = ErrorRecord & {
    getStatus(): number;
    getResponse(): unknown;
    message: string;
};

const isRecord = (value: unknown): value is ErrorRecord =>
    typeof value === 'object' && value !== null;

const isMessage = (value: unknown): value is string | string[] =>
    typeof value === 'string' ||
    (Array.isArray(value) && value.every((item) => typeof item === 'string'));

const isHttpException = (value: unknown): value is HttpExceptionLike =>
    isRecord(value) &&
    typeof value['getStatus'] === 'function' &&
    typeof value['getResponse'] === 'function' &&
    typeof value['message'] === 'string';

@Catch() // Catches all unhandled exceptions coming back from client proxies
export class RpcHttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<HttpResponse>();

        if (isHttpException(exception)) {
            const status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            const body = isRecord(exceptionResponse) ? exceptionResponse : {};
            const bodyError = body['error'];
            const validationIssues = Array.isArray(body['errors'])
                ? body['errors']
                : isRecord(bodyError) && Array.isArray(bodyError['issues'])
                  ? bodyError['issues']
                  : undefined;
            const validationMessages = validationIssues
                ?.map((issue) => (isRecord(issue) ? issue['message'] : undefined))
                .filter((message): message is string => typeof message === 'string');
            const rawMessage = validationMessages?.length ? validationMessages : body['message'];

            response.status(status).json({
                success: false,
                statusCode: status,
                timestamp: new Date().toISOString(),
                errors: {
                    message: isMessage(rawMessage) ? rawMessage : exception.message,
                    error: validationIssues ?? body['error'],
                },
            });
            return;
        }

        const payload = isRecord(exception) ? exception : {};
        const nestedErrors = isRecord(payload['errors']) ? payload['errors'] : {};
        const rawStatus = payload['statusCode'] ?? payload['status'];
        const status =
            typeof rawStatus === 'number' && rawStatus >= 400 && rawStatus <= 599
                ? rawStatus
                : HttpStatus.INTERNAL_SERVER_ERROR;
        const rawMessage = nestedErrors['message'] ?? payload['message'];
        const message = isMessage(rawMessage) ? rawMessage : 'Internal server error';
        const error = nestedErrors['error'] ?? payload['error'] ?? 'RpcError';

        response.status(status).json({
            success: false,
            statusCode: status,
            timestamp:
                typeof payload['timestamp'] === 'string'
                    ? payload['timestamp']
                    : new Date().toISOString(),
            errors: { message, error },
        });
    }
}
