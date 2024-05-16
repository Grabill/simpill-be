import { Global, Module } from "@nestjs/common";
import { PipeService } from "./pipe.service";
import { PipeController } from "./pipe.controller";

@Global()
@Module({
    controllers: [PipeController],
    providers: [PipeService],
    exports: [PipeService]
})
export class PipeModule {}