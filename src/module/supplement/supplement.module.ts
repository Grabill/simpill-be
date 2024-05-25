import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplementController } from './supplement.controller';
import { Supplement, SupplementSchema } from '../../schema/supplement.schema';
import { SupplementService } from './supplement.service';
import { SupplementInteraction, SupplementInteractionSchema } from '../../schema/supplement-interaction.schema';
import { SupplementInteractionPair, SupplementInteractionPairSchema } from '../../schema/supplement-interaction-pair.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Supplement.name, schema: SupplementSchema }]),
        MongooseModule.forFeature([{ name: SupplementInteractionPair.name, schema: SupplementInteractionPairSchema }]),
        MongooseModule.forFeature([{ name: SupplementInteraction.name, schema: SupplementInteractionSchema }]),
    ],
    controllers: [SupplementController],
    providers: [SupplementService],
    exports: [SupplementService],
})
export class SupplementModule {}
