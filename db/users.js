import { fastify } from "../server.js";
import { constants } from "../utils/constants.js";

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

export const addNewUser = async (req, res, date, id, password) => {
    const { name, username } = req.body;
    const client = await fastify.pg.connect();
    try {
        const result = await client.query(
            'INSERT INTO internal.users (id, name, date, username, password) VALUES ($1, $2, $3, $4, $5)', [id, name, date, username, password]
        )
        if (result.rowCount === 1) {
            res.send({
                message: constants.SIGNUPSUCCESS
            })
        } else {
            res.send({
                message: constants.SIGNUPFAIL
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

export const loginUser = (res, username) => {
    return new Promise(async (resolve, reject) => {
        const client = await fastify.pg.connect();
        try {
            const user = await client.query('SELECT * FROM internal.users where username=$1',
                [username]
            )
            if (user?.rows.length > 0) {
                resolve(user.rows)
            } else {
                res.send({
                    statusCode: 404,
                    message: constants.INVALIDUSERNAMEPWD
                })
            }

        } catch (error) {
            res.send({
                error: error
            })
        } finally {
            client.release();
        }
    })
}

export const logout = async (res, sessionId, date) => {
    const client = await fastify.pg.connect();
    try {
        const result = await client.query(
            'update internal.usersession set activesession=$1, logouttime=$2 where sessionid=$3',
            [false, date, sessionId]
        )
        if (result.rowCount == 1) {
            res.send({
                msg: constants.LOGOUT
            })
        }
    } catch (error) {
        res.send({
            msg: constants.SOMETHING_WENT_WRONG,
            errors: error.stack
        })
    } finally {
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

export const recordloginSession = (res, username, id, sessionId, loginTime, token) => {
    return new Promise(async (resolve, reject) => {
        const client = await fastify.pg.connect();
        try {
            const result = await client.query(
                'INSERT INTO internal.usersession (username, id, sessionid, logintime, token, activesession) VALUES ($1, $2, $3, $4, $5, $6)', [username, id, sessionId, loginTime, token, true]
            )
            if (result.rowCount === 1) {
                resolve(true)
            } else {
                reject(false)
            }
        } catch (error) {
            res.send({
                errorss: error
            })
        } finally {
            client.release();
        }
    })
}

export const checkforDuplicateSessionId = (id) => {
    return new Promise(async (resolve, reject) => {
        const client = await fastify.pg.connect();
        try {
            const result = await client.query(
                'SELECT * FROM internal.usersession where sessionid=$1',
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