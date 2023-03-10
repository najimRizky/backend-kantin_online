import express from "express"
const router = express.Router()

import loginvalidation from "./loginValidation.js"
import loginController from "./loginController.js"
import checkValidation from "../../helper/checkValidation.js"

/** @see /api/login */

router.post("/", loginvalidation.login, checkValidation, loginController.login)

export default router