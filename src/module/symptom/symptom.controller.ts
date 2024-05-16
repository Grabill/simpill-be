import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { SymptomService } from './symptom.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
const CACHE_TTL = 60 * 60 * 24 * 1000;

@Controller('symptoms')
@CacheTTL(CACHE_TTL)
@UseInterceptors(CacheInterceptor)
export class SymptomController {
    constructor(
        private readonly symptomService: SymptomService
    ) {}

    @Get()
    async getAllSymptoms() {
        return await this.symptomService.getAllSymptoms();
    }
}
