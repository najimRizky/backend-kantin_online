import express from "express"
const router = express.Router()

import accountValidation from "./accountValidation.js"
import accountController from "./accountController.js"
import checkValidation from "../../helper/checkValidation.js"

/** @see /account */

router.post(
    "/login",
    accountValidation.login,
    checkValidation,
    accountController.login
)
router.post(
    "/register",
    accountValidation.register,
    checkValidation,
    accountController.register
)
router.get(
    "/confirm",
    accountValidation.confirm,
    checkValidation,
    accountController.confirm
)

export default router