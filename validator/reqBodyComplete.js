const reqBodyComplete = (data, requiredField) => {
    for (let field of requiredField) {
        console.log(field)
        if (!Object.keys(data).includes(field)) {
            return false
        }
    }
    return true
}

export default reqBodyComplete