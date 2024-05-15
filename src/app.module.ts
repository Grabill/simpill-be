import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PipeService } from './pipe.service';
import { SupplementModule } from './module/supplement/supplement.module';

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
        SupplementModule,
    ],
    controllers: [AppController],
    providers: [AppService, PipeService],
})
export class AppModule {}
