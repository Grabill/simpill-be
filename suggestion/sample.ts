import { once } from 'events';
import * as fs from 'fs/promises';
import * as net from 'net';

let pipepath = '/tmp/jsPipeSimpill';
let otherPipe = '/tmp/pyPipeSimpill';

async function read(): Promise<string> {
  const fh = await fs.open(otherPipe, fs.constants.O_RDONLY | fs.constants.O_NONBLOCK);
  const pipe = new net.Socket({ fd: fh.fd, readable: true });
  return new Promise((resolve, reject) => {
    pipe.on('data', (data) => {
      resolve(data.toString());
    });
  });
}

async function write() {
  const fh = await fs.open(pipepath, fs.constants.O_RDWR | fs.constants.O_NONBLOCK);
  const pipe = new net.Socket({ fd: fh.fd, readable: false });
  const status = pipe.write('123 fever cough|');
  if (!status) {
    await once(pipe, 'drain');
  }
  await fh.close();
}

read()

write()