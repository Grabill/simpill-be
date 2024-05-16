import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SupplementDocument = HydratedDocument<Supplement>;

class SupplementUse {
    @Prop()
    title: string;

    @Prop()
    uses: string;
}

class SupplementInteractionPair {
    @Prop()
    subtitle: string;

    @Prop()
    content: string;
}

class SupplementInteraction {
    @Prop()
    title: string;

    @Prop()
    annotation: string;

    @Prop([SupplementInteractionPair])
    list: SupplementInteractionPair[];
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

    @Prop([SupplementInteraction])
    interactions: SupplementInteraction[];

    @Prop()
    dosing: string;
}

export const SupplementSchema = SchemaFactory.createForClass(Supplement);