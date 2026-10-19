import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { WarehouseService } from './warehouse.service';

@Controller()
export class WarehouseController {
    constructor(private readonly warehouseService: WarehouseService) {}

    @MessagePattern('findAllWarehouse')
    findAll() {
        return this.warehouseService.findAll();
    }
}
