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

export const addNewUser = async (req, res, date, id, username) => {
    const { name, password } = req.body;
    const client = await fastify.pg.connect();
    try {
        const result = await client.query(
            'INSERT INTO internal.users (id, name, date, username, password) VALUES ($1, $2, $3, $4, $5)', [id, name, date, username, password]
        )
        if (result.rowCount === 1) {
            console.log("User added successfully");
            res.send({
                message: "You have successfully signed up",
            })
        } else {
            res.send({
                message: "Sign up failed"
            })
        }
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

export const getUser = async (req, res, username) => {
    const client = await fastify.pg.connect();
    try {
        const result = await client.query(
            'SELECT name, id, username FROM internal.users where username=$1',
            [username]
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

export const checkForDuplicateUsername = (username) => {
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

export const checkforDuplicateId = (id) => {
    return new Promise(async (resolve, reject) => {
        const client = await fastify.pg.connect();
        try {
            const result = await client.query(
                'SELECT * FROM internal.users where id=$1',
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