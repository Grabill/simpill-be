import { Controller, Get } from '@nestjs/common';
import { SupplementService } from './supplement.service';

@Controller('supplement')
export class SupplementController {
    constructor(private readonly supplementService: SupplementService) {}

    @Get()
    async getSupplements() {
        return this.supplementService.getFirstTenSupplements();
    }
}
