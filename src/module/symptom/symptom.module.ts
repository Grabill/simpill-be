import { Module } from '@nestjs/common';
import { SymptomService } from './symptom.service';
import { SymptomController } from './symptom.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SymptomSchema } from 'src/schema/symptom.schema';
import { CacheModule } from '@nestjs/cache-manager';
// import { BodyPartSchema } from 'src/schema/body-part.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Symptom', schema: SymptomSchema }]),
    // MongooseModule.forFeature([{ name: 'BodyPart', schema: BodyPartSchema }]),
    CacheModule.register(),
  ],
  controllers: [SymptomController],
  providers: [SymptomService]
})
export class SymptomModule {}
