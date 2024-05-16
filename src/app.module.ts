import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupplementModule } from './module/supplement/supplement.module';
import { PipeModule } from './pipe.module';
import { SymptomModule } from './module/symptom/symptom.module';

@Module({
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
        PipeModule,
        SupplementModule,
        SymptomModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
