import { once } from 'events';
import { existsSync } from 'fs';
import * as fs from 'fs/promises';
import * as net from 'net';
import { Injectable, Logger } from '@nestjs/common';
import { PipeQuery } from './pipe-query';

@Injectable()
export class PipeService {
    private readonly pipePath = '/tmp/jsPipeSimpill';
    private readonly otherPipePath = '/tmp/pyPipeSimpill';
    private readonly logger = new Logger(PipeService.name);
    public readonly MAX_PIPE_SIZE = 65536;

    constructor() {
        setTimeout(() => {
            while (!existsSync(this.pipePath)) {
                this.logger.log('Waiting for pipe...');
            }
        }, 1000);
        if (!existsSync(this.pipePath)) {
            throw new Error('Pipe not found');
        }
        else {
            this.logger.log('Pipe found');
        }
    }

    /**
     * Write data to the pipe
     * https://github.com/nodejs/node/issues/23220
     * @param data data to write to the pipe
     * @returns void
     */
    async write2Pipe(data: PipeQuery): Promise<void> {
        const fh = await fs.open(this.pipePath, fs.constants.O_RDWR | fs.constants.O_NONBLOCK);
        const pipe = new net.Socket({ fd: fh.fd, readable: false });
        const status = pipe.write(data.toString());
        if (!status) {
            await once(pipe, 'drain');
        }
        await fh.close();
    }

    /**
     * Listen to the pipe
     * @returns data from the pipe
     */
    async listen2Pipe(): Promise<string> {
        const fh = await fs.open(this.otherPipePath, fs.constants.O_RDONLY | fs.constants.O_NONBLOCK);
        const pipe = new net.Socket({ fd: fh.fd });
        return new Promise((resolve, reject) => {
            pipe.on('data', (data) => {
                resolve(data.toString());
            });
            pipe.on('error', (err) => {
                reject(err);
            });
            fh.close();
        });
    }
}
