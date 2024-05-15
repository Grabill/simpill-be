import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { PipeService } from './pipe.service';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly pipeService: PipeService,
    ) {}

    @Get('/:pid')
    async getHello(@Param('pid') pid: string): Promise<string> {
        console.log('pid:', pid);
        this.pipeService.write2Pipe(pid + ' treament of fever and cough|');
        const data = await this.pipeService.listen2Pipe();
        return data;
    }
}
