import { once } from 'events';
import * as fs from 'fs/promises';
import * as net from 'net';
import { Injectable, Logger } from '@nestjs/common';
import { PipeQuery } from './pipe-query';
import { PipeResult } from './pipe-result';

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
    public results: Map<string, PipeResult> = new Map();
    private readonly TIMEOUT = 30000; // 60 seconds
    private readonly RESULTS_LIMIT = 500;
    private readonly FLUSH_FACTOR = 0.5;

    constructor() {
        if (process.env.SKIP_SUGGESTION === 'true') {
            return;
        }
        // this.logger.log('Waiting for pipe...');
        // let waitForPipe = true;
        // setTimeout(() => {
        //     waitForPipe = false;
        // }, 5000);
        // while (waitForPipe) {
        //     if (existsSync(this.pipePath)) {
        //         break;
        //     }
        // }
        // if (!existsSync(this.pipePath)) {
        //     this.logger.error('Pipe not found');
        //     return;
        // }
        // this.logger.log('Pipe found');
        this.initPipe().then(() => {
            this.logger.log('Pipe initialized');
        });
    }

    // I am not sure if this is the correct way to destroy the pipe
    // Of course it doesn't do anything
    destroy(): void {
        this.readPipe.destroy();
        this.writePipe.destroy();
        this.fhRead.close();
        this.fhWrite.close();
    }

    /**
     * Initialize the pipe
     */
    private async initPipe(): Promise<void> {
        this.fhRead = await fs.open(this.otherPipePath, fs.constants.O_RDWR | fs.constants.O_NONBLOCK);
        this.readPipe = new net.Socket({ fd: this.fhRead.fd, allowHalfOpen: true, writable: false });

        this.fhWrite = await fs.open(this.pipePath, fs.constants.O_RDWR | fs.constants.O_NONBLOCK);
        this.writePipe = new net.Socket({ fd: this.fhWrite.fd, readable: false });

        this.readPipe.on('data', (buffer) => {
            let str = buffer.toString();
            console.log('str:', str);
            const queryStrs = str.split('|').slice(0, -1);
            for (const queryStr of queryStrs) {
                const id = queryStr.slice(0, 36);
                const result = queryStr.slice(36).trimStart().replace('"', '\"');
                const data = JSON.parse(result);
                this.results.set(id, { data: data });
            }
            // if (this.results.size > this.RESULTS_LIMIT) {
            //     this.results = new Map(
            //         Array.from(this.results)
            //         .slice(this.RESULTS_LIMIT * this.FLUSH_FACTOR)
            //     );
            // }
        });
        this.readPipe.on('end', (x) => {
            console.log('closed. hasError: ', x);
            console.log('data listener status: ', this.readPipe.listenerCount('data'));
        });
        this.readPipe.on('close', (x) => {
            console.log('closed. hasError: ', x);
            console.log('data listener status: ', this.readPipe.listenerCount('data'));
        });
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
     * Wait for the result of a query
     * @param id the id of the query
     * @returns the result of the query
     */
    async wait4Result(id: string): Promise<PipeResult> {
        return new Promise(async (resolve, reject) => {
            this.results.set(id, { data: null });
            const interval = setInterval(() => {
                const result = this.results.get(id);
                if (result.data !== null) {
                    clearInterval(interval);
                    resolve(structuredClone(result));
                    this.results.delete(id);
                }
            }, 1000);
            setTimeout(() => {
                clearInterval(interval);
                this.results.delete(id);
                reject(`timeout: ${id}`);
            }, this.TIMEOUT);
        });
    }

    // /**
    //  * Listen to the pipe
    //  * @returns data from the pipe
    //  */
    // async listen2Pipe(): Promise<string> {
    //     // const fh = await fs.open(this.otherPipePath, fs.constants.O_RDONLY | fs.constants.O_NONBLOCK);
    //     // const pipe = new net.Socket({ fd: fh.fd });
    //     // console.log(fh);
    //     return new Promise((resolve, reject) => {
    //         this.readPipe.on('data', (data) => {
    //             resolve(data.toString());
    //         });
    //         this.readPipe.on('error', (err) => {
    //             reject(err);
    //         });
    //         // fh.close();
    //         // cannot close the fifo file here
    //     });
    // }
}
