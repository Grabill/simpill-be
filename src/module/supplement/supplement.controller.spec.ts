import { Test, TestingModule } from '@nestjs/testing';
import { SupplementController } from './supplement.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SupplementService } from './supplement.service';
import { Supplement, SupplementSchema } from '../../schema/supplement.schema';
import { SupplementQueryDto } from './dto/supplement-query.dto';
import { SupplementQueryResultDto } from './dto/supplement-query-result.dto';
import { PipeService } from '../../pipe.service';

describe('SupplementController', () => {
    let controller: SupplementController;
    let service: SupplementService;

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
                MongooseModule.forFeature([{ name: Supplement.name, schema: SupplementSchema }])
            ],
            controllers: [SupplementController],
            providers: [SupplementService, PipeService]
        }).compile();

        controller = module.get<SupplementController>(SupplementController);
        service = module.get<SupplementService>(SupplementService);
    });
    describe('getSupplements', () => {
        it('should returns an array of supplements', async () => {
            const mockQuery: SupplementQueryDto = { q: 'root', exact: false };
            const result: SupplementQueryResultDto[] = [];
            jest.spyOn(service, 'findByName').mockImplementation(async () => result);
            expect(await controller.getSupplements(mockQuery)).toBe(result);
        });
    });
});
