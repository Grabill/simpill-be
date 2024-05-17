import { Injectable } from '@nestjs/common';
import { PipeQuery } from 'src/pipe-query';
import { PipeService } from 'src/pipe.service';

@Injectable()
export class SuggestionService {
    constructor(private readonly pipeService: PipeService) {}

    async generateSuggestion(symptoms: string) {
        const query = new PipeQuery(symptoms);
        await this.pipeService.write2Pipe(query);
        return await this.pipeService.wait4Result(query.id);
    }
}
