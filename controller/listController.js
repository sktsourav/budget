import { addItem, checkItemId, getItemsById } from "../db/list.js"

export const addItemController = async (req, res) => {
    try {
        const generateItemId = async () => {
            const id = Math.floor(Math.random() * 100000);
            const result = await checkItemId(id);
            if (result?.rows?.length > 0) {
                generateItemId()
            }
            return id;
        }

        const date = new Date();
        const { userId, item, value, listId } = req.body;
        const itemId = await generateItemId();
        const result = await addItem(userId, item, value, itemId, date, listId);
        res.send({
            result
        })
    } catch (error) {
        res.send({
            error
        })
    }
}

export const getItemsByIdController = async (req, res) => {
    try {
        const userId = req.body.userId;
        const result = await getItemsById(userId);  
        res.send({
            result: result.rows
        })
    } catch (error) {
        res.send({
            error: error || null,
            nodeError: error.stack || null
        })
    }
}
