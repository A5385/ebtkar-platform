import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class MicroserviceExceptionFilter implements RpcExceptionFilter<RpcException> {
    catch(exception: RpcException, _host: ArgumentsHost): Observable<never> {
        // Access underlying data structure passed to the exception
        const errorData = exception.getError();

        // Log the error centrally inside your microservice if needed
        console.error('Microservice Error:', errorData);

        // You MUST return an RxJS Observable emitting the error payload
        return throwError(() => errorData);
    }
}
