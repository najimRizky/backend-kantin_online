const validator = require('validator');
const responseParser = require('../../../helper/responseParser');
const reqBodyComplete = require('../../../validator/reqBodyComplete');

const requiredield = ["email", "password", "full_name"]
const validFullname = /^[A-Z][a-z]*( [A-Z][a-z]*)*([-][A-Z][a-z]*)*$/;

const registerMiddleware = async (req, res, next) => {
    const body = req.body

    if (reqBodyComplete(body, requiredield)) {
        if (validator.isEmail(body.email) && validFullname.test(body.full_name) && validator.isLength(body.password, { min: 6 })) {
            next()
        } else {
            return responseParser({ status: 400 }, res)
        }
    } else {
        return responseParser({ status: 400, message: "All fields required" }, res)
    }
}

module.exports = registerMiddleware