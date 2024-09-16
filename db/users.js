import { fastify } from "../server.js";

export const fetchAllUsers = async (req, res) => {
    const client = await fastify.pg.connect();
    try {
        const { rows } = await client.query(
            'SELECT * FROM internal.users'
        )
        res.send({
            result: rows
        })
    } catch (err) {
        res.send({
            message: err.message
        })
    }
    finally {
        client.release()
    }
}

export const addNewUser = async (req, res, id, name, date, username, password) => {
    const client = await fastify.pg.connect();
    try {
        await checkUsername(username)
        const result = await client.query(
            'INSERT INTO internal.users (id, name, date, username, password) VALUES ($1, $2, $3, $4, $5)', [id, name, date, username, password]
        )
        res.send({
            result: result
        })
    } catch (err) {
        res.send({
            message: err.message,
            error: err.stack
        })
    }
    finally {
        client.release();
    }
}

export const getUser = async (req, res, id) => {
    const client = await fastify.pg.connect();
    try {
        const result = await client.query(
            'SELECT * FROM internal.users where id=$1',
            [id]
        )
        res.send({
            result: result?.rows
        })
    } catch (err) {
        res.send({
            message: err.message,
            error: err.stack
        })
    }
    finally {
        client.release();
    }
}

export const checkUsername = (username) => {
    return new Promise(async (resolve, reject) => {
        const client = await fastify.pg.connect();
        try {
            const result = await client.query(
                'SELECT * FROM internal.users where username=$1',
                [username]
            )
            resolve(result);
        } catch (error) {
            reject(error.stack);
        } finally {
            client.release();
        }
    })
}