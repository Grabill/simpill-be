import { Test, TestingModule } from '@nestjs/testing';
import { SupplementController } from './supplement.controller';

describe('SupplementController', () => {
    let controller: SupplementController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SupplementController],
        }).compile();

        controller = module.get<SupplementController>(SupplementController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
