import { fetchAllUsers, addNewUser, getUser, checkForDuplicateUsername, checkforDuplicateId, loginUser } from "../db/users.js";
import { generateId } from "../helper/index.js"
import bcrypt from "bcrypt";
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
        await verifyUserCredential(res, password, userDetails[0].password)
    } catch (error) {
        res.send({
            error: error.stack,
            message: error.message
        })
    }
}

const verifyUserCredential = async (res, inputPassword, password) => {
    const match = await bcrypt.compare(inputPassword, password);
    if (match === true) {
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