import { Injectable } from '@nestjs/common';

@Injectable()
export class WarehouseService {
    findAll() {
        return `This action returns all warehouse`;
    }
}
