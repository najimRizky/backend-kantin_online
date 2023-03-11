import { body, query } from "express-validator"

import validFullName from "../../config/validFullName.js"

const register = [
    body("email")
        .exists({ checkFalsy: true })
        .withMessage("Email is required")
        .isEmail(),
    body("full_name")
        .exists({ checkFalsy: true })
        .withMessage("Full Name is required")
        .custom((value) => {
            if (!validFullName.test(value)) throw new Error("Invalid Full Name")
            return true
        }),
    body("password")
        .exists({ checkFalsy: true })
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password min length")
]

const confirm = [
    query("token")
        .exists({ checkFalsy: true })
        .withMessage("Invalid Token")
]

export default {
    register,
    confirm
}