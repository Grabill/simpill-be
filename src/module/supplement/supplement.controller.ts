import { Controller, Get, Query, Param } from '@nestjs/common';
import { SupplementService } from './supplement.service';
import { SupplementQueryDto } from './dto/supplement-query.dto';

@Controller('supplements')
export class SupplementController {
    constructor(private readonly supplementService: SupplementService) {}

    @Get()
    async getSupplements(@Query() query: SupplementQueryDto) {
        return await this.supplementService.findByName(query.q, query.exact);
    }

    @Get(':name')
    async getDetailedSupplementByName(@Param('name') name: string) {
        const result = await this.supplementService.findByName(name, true);
        return result.length > 0 ? result[0] : {};
    }
}
