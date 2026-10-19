import { Injectable } from '@nestjs/common';

@Injectable()
export class InvoiceService {
    findAll() {
        return `This action returns all invoice`;
    }
}
