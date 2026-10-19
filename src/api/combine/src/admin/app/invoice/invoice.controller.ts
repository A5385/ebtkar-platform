import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InvoiceService } from './invoice.service';

@Controller()
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {}

    @MessagePattern('findAllInvoice')
    findAll() {
        return this.invoiceService.findAll();
    }
}
