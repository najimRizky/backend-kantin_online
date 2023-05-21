import { body, query } from "express-validator"
import validFullName from "../../config/validFullName.js"

const login = [
    body("email")
        .exists({ checkFalsy: true })
        .withMessage("Email is required")
        .isEmail(),
    body("password")
        .exists({ checkFalsy: true })
        .withMessage("Password is required")
]


const register = [
    body("email")
        .exists({ checkFalsy: true })
        .withMessage("Email is not included or invalid")
        .isEmail()
    ,
    body("full_name")
        .exists({ checkFalsy: true })
        .withMessage("Full name is not included or invalid")
        .custom((value) => {
            if (!validFullName.test(value)) return false
            return true
        })
    ,
    body("password")
        .exists({ checkFalsy: true })
        .withMessage("Password must be included with at least 6 characters long")
        .isLength({ min: 6 })
    ,
    body("confirm_password")
        .exists({ checkFalsy: true })
        .withMessage("Confirm password must match password.")
        .custom((value, { req }) => value === req.body.password)
    ,
]

const confirm = [
    query("token")
        .exists({ checkFalsy: true })
        .withMessage("Invalid Token")
]

const requestResetPassword = [
    body("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Email is not incluede or invalid")
]

const resetPassword = [
    body("new_password")
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage("Password must be included with at least 6 characters long."),
    body("confirm_new_password")
        .exists({ checkFalsy: true })
        .custom((value, { req }) => value === req.body.new_password)
        .withMessage("Confirm new password must be matched with new password."),
    body("token")
        .exists({ checkFalsy: true })
        .isLength({ min: 24 })
        .withMessage("Token is not included or invalid"),
]

export default {
    login,
    register,
    confirm,
    requestResetPassword,
    resetPassword
}