export const generateId = async (callBack, length) => {
    return new Promise(async (resolve, reject) => {
        const id = Math.floor(Math.random() * length);
        const result = await callBack(id);
        if (result?.rows?.length > 0) {
            generateId()
        }
        resolve(id)
    })
}