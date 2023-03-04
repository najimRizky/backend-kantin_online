const reqBodyComplete = (data, field) => {
    for (let i = 0; i < field.length; i++) {
        if (!data[field[i]]) {
            return false
        }
    }
    return true
}

module.exports = reqBodyComplete