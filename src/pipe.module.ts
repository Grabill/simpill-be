import { Global, Module } from "@nestjs/common";
import { PipeService } from "./pipe.service";

@Global()
@Module({
    providers: [PipeService],
    exports: [PipeService]
})
export class PipeModule {}