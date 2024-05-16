import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { BodyPart } from './body-part.schema';

export type SymptomDocument = HydratedDocument<Symptom>;

@Schema()
export class Symptom {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'BodyPart' })
    bodyPart: BodyPart;

    @Prop({ required: true })
    name: string;
}

export const SymptomSchema = SchemaFactory.createForClass(Symptom);