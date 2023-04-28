import express from "express"
const router = express.Router()

import accountValidation from "./accountValidation.js"
import accountController from "./accountController.js"
import checkValidation from "../../helper/checkValidation.js"
import requireAuth from "../../validation/requireAuth.js"

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

/** @CHECK_ACCESS_TOKEN_VALIDITY */
router.get(
    "/validate-token",
    requireAuth(),
    accountController.validateToken
)

/** @REQUEST_AND_SEND_RESET_PASSWORD_LINK */
router.post(
    "/request-reset-password",
    accountValidation.requestResetPassword,
    checkValidation,
    accountController.requestResetPassword
)

/** @RESET_PASSWORD */
router.post(
    "/reset-password",
    accountValidation.resetPassword,
    checkValidation,
    accountController.resetPassword
)

export default router