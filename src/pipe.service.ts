import * as fs from 'fs';
import * as net from 'net';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PipeService {
    private readonly pipePath = '/tmp/jsPipeSimpill';
    private readonly otherPipePath = '/tmp/pyPipeSimpill';

    async write2Pipe(data: string): Promise<void> {
        try {
            const fd = await new Promise<number>((resolve, reject) => {
                fs.open(this.pipePath, fs.constants.O_WRONLY, (err, fd) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(fd);
                    }
                });
            });

            await new Promise<void>((resolve, reject) => {
                fs.write(fd, data, (err, written) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(`Wrote ${written} bytes to pipe`);
                        resolve();
                    }
                });
            });

            await new Promise<void>((resolve, reject) => {
                fs.close(fd, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        } catch (error) {
            console.error('Error writing to pipe:', error);
            throw error;
        }
    }

    async listen2Pipe(): Promise<string> {
        try {
            const fd = await new Promise<number>((resolve, reject) => {
                fs.open(
                    this.otherPipePath,
                    fs.constants.O_RDONLY | fs.constants.O_NONBLOCK,
                    (err, fd) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(fd);
                        }
                    },
                );
            });

            const pipe = new net.Socket({ fd });

            return new Promise<string>((resolve, reject) => {
                pipe.on('data', (data) => {
                    console.log(`Received ${data.length} bytes from pipe`);
                    resolve(data.toString());
                });

                pipe.on('error', (error) => {
                    reject(error);
                });
            });
        } catch (error) {
            console.error('Error opening pipe:', error);
            throw error;
        }
    }
}
