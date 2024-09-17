import { fetchAllUsers, addNewUser, getUser, checkForDuplicateUsername, checkforDuplicateId } from "../db/users.js";
import { generateId } from "../helper/index.js"
import bcrypt from "bcrypt";
const saltRounds = 10;

export const fetchAllUsersController = (req, res) => {
    fetchAllUsers(req, res);
}

export const addNewUserController = (req, res) => {
    try {
        const date = new Date();
        const { username } = req.body;

        bcrypt.hash(username, saltRounds, async function (err, hash) {
            const id = "USER" + await generateId(checkforDuplicateId, 1000000000);
            const user = await checkForDuplicateUsername(hash);

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

export const loginController = (req, res) => {
    try {
        const { username, password } = req.body;
        
    } catch (error) {
        res.send({
            error: error.stack,
            message: error.message
        })
    }
}