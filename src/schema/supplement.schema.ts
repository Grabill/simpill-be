import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SupplementDocument = HydratedDocument<Supplement>;

@Schema()
export class Supplement {
    @Prop()
    name: string;

    @Prop()
    overview: string;

    @Prop()
    uses: string;

    @Prop()
    side_effects: string;

    @Prop()
    interactions: string;

    @Prop()
    dosing: string;
}

export const SupplementSchema = SchemaFactory.createForClass(Supplement);