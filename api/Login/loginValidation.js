import { body } from "express-validator"

const login = [
    body("email")
        .exists({ checkFalsy: true })
        .withMessage("Email is required")
        .isEmail(),
    body("password")
        .exists({ checkFalsy: true })
        .withMessage("Password is required")
]

export default {
    login,
}