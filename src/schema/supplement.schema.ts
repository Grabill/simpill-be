import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { SupplementInteraction } from './supplement-interaction.schema';

export type SupplementDocument = HydratedDocument<Supplement>;

class SupplementUse {
    @Prop()
    title: string;

    @Prop()
    uses: string;
}

@Schema()
export class Supplement {
    @Prop({ required: true })
    name: string;

    @Prop()
    overview: string;

    @Prop([SupplementUse])
    uses: SupplementUse[];

    @Prop()
    side_effects: string;

    @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'SupplementInteraction' }])
    interactions: SupplementInteraction[];

    @Prop()
    dosing: string;
}

export const SupplementSchema = SchemaFactory.createForClass(Supplement);