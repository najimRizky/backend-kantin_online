const { validationResult } = require("express-validator")
const responseParser = require("./responseParser")

const checkValidation = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return responseParser({status: 400, error: errors.array()}, res)
    }
    next()
}

module.exports = checkValidation