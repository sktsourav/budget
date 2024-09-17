import { fetchAllUsers, addNewUser, getUser, checkForDuplicateUsername, checkforDuplicateId, loginUser, recordloginSession } from "../db/users.js";
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
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    if (match === true) {
        await recordloginSession(res, userDetails.username, userDetails.id, "ajdwqduwqhs2132312312", new Date(), token)
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