import { fastify } from "../server.js";

export const addItem = (userId, item, value, itemId, date, listId) => {
    return new Promise(async (resolve, reject) => {
        const client = await fastify.pg.connect();
        try {
            const result = await client.query(
                'INSERT INTO internal.list (userid, item, value, itemid, date, listid) VALUES ($1, $2, $3, $4, $5, $6)', [userId, item, value, itemId, date, listId]
            )
            resolve(result)
        } catch (error) {
            reject(error.stack)
        } finally {
            client.release();
        }
    })
}

export const checkItemId = (id) => {
    return new Promise(async (resolve, reject) => {
        const client = await fastify.pg.connect();
        try {
            const result = await client.query(
                'SELECT * FROM internal.list where itemid=$1',
                [id]
            )
            resolve(result);
        } catch (error) {
            reject(error.stack);
        } finally {
            client.release();
        }
    })
}

export const getItemsById = async (id) => {
    return new Promise(async (resolve, reject) => {
        const client = await fastify.pg.connect();
        try {
            const result = await client.query(
                'SELECT * FROM internal.list where userId=$1',
                [id]
            )
            resolve(result);
        } catch (error) {
            reject(error.stack);
        } finally {
            client.release();
        }
    })
}