import { Injectable } from '@nestjs/common';
import { PipeQuery } from '../../pipe-query';
import { PipeService } from '../../pipe.service';
import { SupplementService } from '../supplement/supplement.service';

@Injectable()
export class SuggestionService {
    constructor(
        private readonly pipeService: PipeService,
        private readonly supplementService: SupplementService) {}

    /**
     * Generate a suggestion based on the symptoms
     * @param symptoms a string of symptoms
     * @returns an array of SupplementQueryResultDto 
     */
    async generateSuggestion(symptoms: string) {
        const query = new PipeQuery(symptoms);
        await this.pipeService.write2Pipe(query);
        const result = await this.pipeService.wait4Result(query.id);
        return await this.supplementService.findByPipeResult(result);
    }
}
