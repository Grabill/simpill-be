import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as morgan from 'morgan';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(morgan('dev'));
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors(
        {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
        }
    )
    await app.listen(process.env.PORT || 8000);
}

bootstrap();
