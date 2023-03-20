const addCart = async (req, res) => {
    /** @Todo Add Cart Logic */
    return res.send("Add Cart")
}

const subtractCart = async (req, res) => {
    /** @Todo Subtract Cart Logic */
    return res.send("Subtract Cart")
}

const deleteCart = async (req, res) => {
    /** @Todo Delete Cart Logic */
    return res.send("Delete Cart")
}

export default {
    addCart,
    subtractCart,
    deleteCart,
}