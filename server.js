import Fastify from 'fastify'
import helloWorld from './routes/hello-world.js';

const fastify = Fastify({
    logger: true
});

fastify.register(helloWorld);

fastify.listen({port: 8000}, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});