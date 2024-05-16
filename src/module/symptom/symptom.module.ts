import { Module } from '@nestjs/common';
import { SymptomService } from './symptom.service';
import { SymptomController } from './symptom.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SymptomSchema } from 'src/schema/symptom.schema';
import { BodyPartSchema } from 'src/schema/body-part.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Symptom', schema: SymptomSchema }]),
    MongooseModule.forFeature([{ name: 'BodyPart', schema: BodyPartSchema }])
  ],
  controllers: [SymptomController],
  providers: [SymptomService]
})
export class SymptomModule {}
