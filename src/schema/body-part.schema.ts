import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BodyPartDocument = HydratedDocument<BodyPart>;

@Schema()
export class BodyPart {
    @Prop({ required: true })
    name: string;
}

export const BodyPartSchema = SchemaFactory.createForClass(BodyPart);