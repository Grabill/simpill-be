export default async function helloWorld(fastify, _) {
    fastify.get('/hello', async (_, res) => {
        res.code(200).send({hello: 'Hello world!'});
    });
}