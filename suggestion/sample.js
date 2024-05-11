const fs = require('fs');
const net = require('net');

let pipepath = '/tmp/jsPipeSimpill';
let otherPipe = '/tmp/pyPipeSimpill';

fs.open(otherPipe, fs.constants.O_RDONLY | fs.constants.O_NONBLOCK, (err, fd) => {
  // Handle err
  const pipe = new net.Socket({ fd });
  // Now `pipe` is a stream that can be used for reading from the FIFO.
  pipe.on('data', data => {
    console.log('Received from pipe:', data.toString());
  });

});

fs.open(pipepath, fs.constants.O_WRONLY, (err, fd) => {
  fs.write(fd, '123 fever cough|', (err, written, string) => {
      console.log('Written:', written);
  });
});