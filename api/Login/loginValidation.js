const { body } = require("express-validator")

const login = [
    body("email")
        .exists({ checkFalsy: true })
        .withMessage("Email is required")
        .isEmail(),
    body("password")
        .exists({ checkFalsy: true })
        .withMessage("Password is required")
]

module.exports = {
    login,
}