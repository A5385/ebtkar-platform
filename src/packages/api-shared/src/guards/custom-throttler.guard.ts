import { HttpException, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
    protected override async throwThrottlingException(): Promise<void> {
        throw new HttpException(
            {
                message: 'Too many requests. Please try again later.',
            },
            429,
        );
    }
}
