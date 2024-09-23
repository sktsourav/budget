import {
    addNewUserController,
    fetchAllUsersController,
    getUserController,
    loginController,
    logoutController
} from './controller/usersController.js';
import testAPI from './controller/testController.js';
import { addItemController, getItemsByIdController } from './controller/listController.js';

const routes = async (fastify, options) => {
    fastify.get("/", async (request, response) => {
        response.send("Connection on")
    })

    fastify.get("/testApi", (req, res) => testAPI(req, res))

    fastify.get('/fetchAllUsers', (req, res) => fetchAllUsersController(req, res))

    fastify.post("/signup", (req, res) => addNewUserController(req, res))

    fastify.post("/getUser", (req, res) => getUserController(req, res))

    fastify.post("/addListItem", (req, res) => addItemController(req, res))

    fastify.post("/getItemsById", (req, res) => getItemsByIdController(req, res))

    fastify.post("/login", (req, res) => loginController(req, res))

    fastify.post("/logout", (req, res) => logoutController(req, res))
}

export default routes