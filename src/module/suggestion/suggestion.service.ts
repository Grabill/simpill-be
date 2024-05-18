import { Injectable } from '@nestjs/common';
import { PipeQuery } from 'src/pipe-query';
import { PipeService } from 'src/pipe.service';
import { SupplementService } from '../supplement/supplement.service';

@Injectable()
export class SuggestionService {
    constructor(
        private readonly pipeService: PipeService,
        private readonly supplementService: SupplementService) {}

    async generateSuggestion(symptoms: string) {
        const query = new PipeQuery(symptoms);
        await this.pipeService.write2Pipe(query);
        const result = await this.pipeService.wait4Result(query.id);
        return await this.supplementService.findByPipeResult(result);
    }
}
