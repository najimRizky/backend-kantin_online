const validator = require('validator');
const responseParser = require('../../../helper/responseParser');
const reqBodyComplete = require('../../../validator/reqBodyComplete');

const field = ["email", "password", "full_name"]

const registerMiddleware = async (req, res, next) => {
    const body = req.body

    if (reqBodyComplete(body, field)) {
        if (validator.isEmail(body.email) && validator.isAlpha(body.full_name) && validator.isLength(body.password, { min: 6 })) {
            next()
        } else {
            return responseParser({ status: 400 }, res)
        }
    } else {
        return responseParser({ status: 400, message: "All fields required" }, res)
    }
}

module.exports = registerMiddleware