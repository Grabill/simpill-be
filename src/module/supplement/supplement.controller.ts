import { Controller, Get, Query } from '@nestjs/common';
import { SupplementService } from './supplement.service';
import { SupplementQueryDto } from './dto/supplement-query.dto';

@Controller('supplements')
export class SupplementController {
    constructor(private readonly supplementService: SupplementService) {}

    @Get()
    async getSupplements(@Query() query: SupplementQueryDto) {
        console.log(query);
        return await this.supplementService.findByName(query.q, query.exact);
    }
}
