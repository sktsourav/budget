import { fetchAllUsers, addNewUser, getUser, checkForDuplicateUsername, checkforDuplicateId } from "../db/users.js"
import { generateId } from "../helper/index.js"

export const fetchAllUsersController = (req, res) => {
    fetchAllUsers(req, res);
}

export const addNewUserController = async (req, res) => {
    try {
        const date = new Date();
        const { username } = req.body;
        const id = "USER" + await generateId(checkforDuplicateId, 1000000000);
        const user = await checkForDuplicateUsername(username);

        if (user?.rows?.length > 0) {
            res.send({
                message: "This username is already in use."
            })
        } else {
            await addNewUser(req, res, date, id);
        }
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