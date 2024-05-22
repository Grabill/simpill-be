import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { SuggestionService } from './suggestion.service';
import { SuggestionQueryDto } from './dto/suggestion-query.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
const CACHE_TTL = 60 * 100000; // 60 minutes

@Controller('suggestions')
@CacheTTL(CACHE_TTL)
@UseInterceptors(CacheInterceptor)
export class SuggestionController {
    constructor(private readonly suggestionService: SuggestionService) {}

    @Get()
    async get(@Query() query: SuggestionQueryDto) {
        return await this.suggestionService.generateSuggestion(query.q);
    }
}
