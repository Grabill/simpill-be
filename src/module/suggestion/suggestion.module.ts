import { Module } from '@nestjs/common';
import { SuggestionService } from './suggestion.service';
import { SuggestionController } from './suggestion.controller';
import { SupplementModule } from '../supplement/supplement.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    SupplementModule,
    CacheModule.register()
  ],
  providers: [SuggestionService],
  controllers: [SuggestionController]
})
export class SuggestionModule {}
