import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplementController } from './supplement.controller';
import { Supplement, SupplementSchema } from '../../schema/supplement.schema';
import { SupplementService } from './supplement.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Supplement.name, schema: SupplementSchema }])],
    controllers: [SupplementController],
    providers: [SupplementService],
    exports: [SupplementService],
})
export class SupplementModule {}
