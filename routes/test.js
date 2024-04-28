import Bulb from "../model/bulb.js";

export default async function testRoutes(fastify, _) {
    fastify.get('/hello', async (_, res) => {
        res.code(200).send('Hello world!');
    });
    fastify.post('/bulb/:name', async (req, res) => {
        const bulb = new Bulb({
            name: req.params.name,
            status: false
        });
        await bulb.save();
        res.code(201).send(bulb);
    });
    fastify.put('/bulb/:name/on', async (req, res) => {
        const bulb = await Bulb.findOne({ name: req.params.name });
        if (!bulb) {
            res.code(404).send('Bulb not found');
        }
        else if (bulb.status) {
            res.code(400).send('Bulb is already on');
        }
        else {
            bulb.status = true;
            await bulb.save();
            res.code(200).send('Bulb is on');
        }
    });
    fastify.put('/bulb/:name/off', async (req, res) => {
        const bulb = await Bulb.findOne({ name: req.params.name });
        if (!bulb) {
            res.code(404).send('Bulb not found');
        }
        else if (!bulb.status) {
            res.code(400).send('Bulb is already off');
        }
        else {
            bulb.status = false;
            await bulb.save();
            res.code(200).send('Bulb is off');
        }
    });
    fastify.get('/bulb/:name', async (req, res) => {
        const bulb = await Bulb.findOne({ name: req.params.name });
        if (!bulb) {
            res.code(404).send('Bulb not found');
        }
        else {
            res.code(200).send(bulb);
        }
    });
    fastify.delete('/bulb/:name', async (req, res) => {
        const bulb = await Bulb.findOne({ name: req.params.name });
        if (!bulb) {
            res.code(404).send('Bulb not found');
        }
        else {
            await bulb.delete();
            res.code(200).send('Bulb deleted');
        }
    });
}