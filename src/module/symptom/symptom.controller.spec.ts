import { Test, TestingModule } from '@nestjs/testing';
import { SymptomController } from './symptom.controller';
import { SymptomService } from './symptom.service';
import { SymptomQueryResultDto } from './dto/symptom-query-result.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { SymptomSchema } from '../../schema/symptom.schema';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';

describe('SymptomController', () => {
    let controller: SymptomController;
    let service: SymptomService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                }),
                MongooseModule.forRoot(
                    process.env.MONGODB_URI.replace(
                        '<PASSWORD>',
                        process.env.MONGODB_PASSWORD,
                    ),
                ),
                MongooseModule.forFeature([{ name: 'Symptom', schema: SymptomSchema }]),
                CacheModule.register(),
              ],
            controllers: [SymptomController],
            providers: [SymptomService]
        }).compile();

        controller = module.get<SymptomController>(SymptomController);
        service = module.get<SymptomService>(SymptomService);
    });
    
    describe('getAllSymptoms', () => {
        it('should returns an array of symptom groups (body parts)', async () => {
            const result: SymptomQueryResultDto[] = [];
            jest.spyOn(service, 'getAllSymptoms').mockImplementation(async () => result);
            expect(await controller.getAllSymptoms()).toBe(result);
        });
    });
});
