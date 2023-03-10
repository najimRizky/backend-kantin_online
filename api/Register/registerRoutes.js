import express from "express"
const router = express.Router()

import registerValidation from "./registerValidation.js"
import registerController from "./registerController.js"
import checkValidation from "../../helper/checkValidation.js"

/** @see /api/register */

router.post("/", registerValidation.register, checkValidation, registerController.register)
router.get("/confirm", registerValidation.confirm, checkValidation, registerController.confirm)

export default router