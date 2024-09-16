import { fetchAllUsers, addNewUser, getUser } from "../db/users.js"

export const fetchAllUsersController = (req, res) => {
    fetchAllUsers(req, res);
}

export const addNewUserController = (req, res) => {
    try {
        const date = new Date();
        const { name, id, username, password } = req.body;
        addNewUser(req, res, id, name, date, username, password);
    } catch (error) {
        res.send({
            error: error.stack,
            message: error.message
        })
    }
}

export const getUserController = (req, res) => {
    try {
        const id = req.body.id;
        getUser(req, res, id);
    } catch (error) {
        res.send({
            error: error.stack,
            message: error.message
        })
    }
}