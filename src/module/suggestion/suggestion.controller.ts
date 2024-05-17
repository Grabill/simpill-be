import { Controller, Get, Query } from '@nestjs/common';
import { SuggestionService } from './suggestion.service';
import { SuggestionQueryDto } from './dto/suggestion-query.dto';

@Controller('suggestions')
export class SuggestionController {
    constructor(private readonly suggestionService: SuggestionService) {}

    @Get()
    async get(@Query() query: SuggestionQueryDto) {
        return await this.suggestionService.generateSuggestion(query.q);
    }
}
