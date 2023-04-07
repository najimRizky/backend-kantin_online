import express from "express"
const router = express.Router()

import accountValidation from "./accountValidation.js"
import accountController from "./accountController.js"
import checkValidation from "../../helper/checkValidation.js"

/** @see /account */

/** @LOGIN_CUSTOMER_TENANT */
router.post(
    "/login",
    accountValidation.login,
    checkValidation,
    accountController.login
)

/** @REGISTER_CUSTOMER */
router.post(
    "/register",
    accountValidation.register,
    checkValidation,
    accountController.register
)

/** @CONFIRM_CUSTOMER_ACCOUNT */
router.get(
    "/confirm",
    accountValidation.confirm,
    checkValidation,
    accountController.confirm
)

export default router