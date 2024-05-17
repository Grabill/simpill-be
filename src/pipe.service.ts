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
    private readPipe: net.Socket;
    private writePipe: net.Socket;
    private fhRead: fs.FileHandle;
    private fhWrite: fs.FileHandle;
    public readonly MAX_PIPE_SIZE = 65536;

    constructor() {
        if (process.env.SKIP_SUGGESTION === 'true') {
            return;
        }
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
        
        this.initPipe().then(() => {
            this.logger.log('Pipe initialized');
        });
    }

    // I am not sure if this is the correct way to destroy the pipe
    destroy(): void {
        this.readPipe.destroy();
        this.writePipe.destroy();
        this.fhRead.close();
        this.fhWrite.close();
    }

    // initialize the readPipe by opening the pipe file and creating a socket
    async initPipe(): Promise<void> {
        this.fhRead = await fs.open(this.otherPipePath, fs.constants.O_RDONLY | fs.constants.O_NONBLOCK);
        this.readPipe = new net.Socket({ fd: this.fhRead.fd });

        this.fhWrite = await fs.open(this.pipePath, fs.constants.O_RDWR | fs.constants.O_NONBLOCK);
        this.writePipe = new net.Socket({ fd: this.fhWrite.fd, readable: false });
    }

    /**
     * Write data to the pipe
     * https://github.com/nodejs/node/issues/23220
     * @param data data to write to the pipe
     * @returns void
     */
    async write2Pipe(data: PipeQuery): Promise<void> {
        // const fh = await fs.open(this.pipePath, fs.constants.O_RDWR | fs.constants.O_NONBLOCK);
        // const pipe = new net.Socket({ fd: fh.fd, readable: false });
        const status = this.writePipe.write(data.toString());
        if (!status) {
            await once(this.writePipe, 'drain');
        }
        // await fh.close();
    }

    /**
     * Listen to the pipe
     * @returns data from the pipe
     */
    async listen2Pipe(): Promise<string> {
        // const fh = await fs.open(this.otherPipePath, fs.constants.O_RDONLY | fs.constants.O_NONBLOCK);
        // const pipe = new net.Socket({ fd: fh.fd });
        // console.log(fh);
        return new Promise((resolve, reject) => {
            this.readPipe.on('data', (data) => {
                resolve(data.toString());
            });
            this.readPipe.on('error', (err) => {
                reject(err);
            });
            // fh.close();
            // cannot close the fifo file here
        });
    }
}
