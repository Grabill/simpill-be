import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SupplementInteractionPairDocument = HydratedDocument<SupplementInteractionPair>;

@Schema()
export class SupplementInteractionPair {
    @Prop()
    subtitle: string;

    @Prop()
    content: string;
}

export const SupplementInteractionPairSchema = SchemaFactory.createForClass(SupplementInteractionPair);