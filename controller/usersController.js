import { fetchAllUsers, addNewUser, getUser, checkForDuplicateUsername, checkforDuplicateId, loginUser, recordloginSession, checkforDuplicateSessionId, logout } from "../db/users.js";
import { generateId } from "../helper/index.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const saltRounds = 10;

export const fetchAllUsersController = (req, res) => {
    fetchAllUsers(req, res);
}

export const addNewUserController = (req, res) => {
    try {
        const date = new Date();
        const { username, password } = req.body;

        bcrypt.hash(password, saltRounds, async function (err, hash) {
            const id = "USER" + await generateId(checkforDuplicateId, 1000000000);
            const user = await checkForDuplicateUsername(username);

            if (user?.rows?.length > 0) {
                res.send({
                    message: "This username is already in use."
                })
            } else {
                await addNewUser(req, res, date, id, hash);
            }
        });
    } catch (error) {
        res.send({
            error: error.stack,
            message: error.message
        })
    }
}

export const getUserController = (req, res) => {
    try {
        const username = req.body.username;
        getUser(req, res, username);
    } catch (error) {
        res.send({
            error: error.stack,
            message: error.message
        })
    }
}

export const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userDetails = await loginUser(res, username);
        await verifyUserCredential(res, password, userDetails[0])
    } catch (error) {
        res.send({
            error: error.stack,
            message: error.message
        })
    }
}

const verifyUserCredential = async (res, inputPassword, userDetails) => {
    const match = await bcrypt.compare(inputPassword, userDetails.password);
    if (match === true) {
        const token = await jwt.sign({
            "username": userDetails.username,
            "name": userDetails.name
        }, 'ABCXYZSECRETS', { expiresIn: 60 * 60, algorithm: "HS256" });

        const sessionId = "SESSION" + await generateId(checkforDuplicateSessionId, 100000000000);
        await recordloginSession(res, userDetails.username, userDetails.id, sessionId, new Date(), token)
        res.send({
            statusCode: 200,
            message: "LOGGED IN SUCCESSFULLY"
        })
    } else {
        res.send({
            statusCode: 401,
            message: "INVALID USERNAME OR PASSWORD"
        })
    }
}

export const logoutController = (req, res) => {
    try {
        const date = new Date();
        const {sessionId} = req.body
        logout(res, sessionId, date)
    } catch (error) {
        res.send({
            error: error
        })
    }
}