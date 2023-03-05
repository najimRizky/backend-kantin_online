const { body, param } = require("express-validator")

const validFullName = /^[A-Z][a-z]*( [A-Z][a-z]*)*([-][A-Z][a-z]*)*$/;

const register = [
    body("email")
        .exists({ checkFalsy: true })
        .withMessage("Email is required")
        .isEmail(),
    body("full_name")
        .exists({ checkFalsy: true })
        .withMessage("Full Name is required")
        .custom((value) => {
            if (!validFullName.test(value)) throw new Error("tes")
            return true
        }),
    body("password")
        .exists({ checkFalsy: true })
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password min length")
]

const confirm = [
    param("token")
        .exists({ checkFalsy: true })
        .withMessage("Invalid Token")
]

module.exports = {
    register,
    confirm
}