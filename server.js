import Fastify from 'fastify';
import testRoutes from './routes/test.js';
import { configDotenv } from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
configDotenv();

// Connect to MongoDB
const CONNECTION_URL = process.env.MONGODB_URI.replace('<PASSWORD>', process.env.MONGODB_PASSWORD);

mongoose.connect(CONNECTION_URL).then(() => {
    console.log('[database] connected');
})
.catch((error) => {
    console.log('[database] ' + error.message);
    process.exit(1);
});

const fastify = Fastify({
    logger: true
});

// Register the routes
fastify.register(testRoutes);

// Start the server
fastify.listen({port: process.env.PORT || 8000}, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});