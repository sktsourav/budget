import Fastify from 'fastify';
import routes from './routes.js';
import fastifyPostgress from "@fastify/postgres";

export const fastify = Fastify({
    logger: true
})

fastify.register(routes)
fastify.register(fastifyPostgress, {
    connectionString: 'postgres://postgres:India@123@localhost:5432/budget'
});

console.log("Date", new Date().toLocaleDateString());

// Run the server!
fastify.listen({ port: 5000 }, (err, address) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    } else {
        console.log("Server running on address");
    }
})