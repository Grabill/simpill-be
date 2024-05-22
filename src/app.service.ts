import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

    /**
     * Get a hello message from the service
     * @returns 'Hello World!'
     */
    getHello(): string {
        return 'Hello World!';
    }
}
