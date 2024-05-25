import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SupplementInteractionPair } from "./supplement-interaction-pair.schema";
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type SupplementInteractionDocument = HydratedDocument<SupplementInteraction>;

@Schema()
export class SupplementInteraction {
    @Prop()
    title: string;

    @Prop()
    annotation: string;

    @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'SupplementInteractionPair' }])
    list: SupplementInteractionPair[];
}

export const SupplementInteractionSchema = SchemaFactory.createForClass(SupplementInteraction);