const express = require("express")
const router = express.Router()

const validation = require("./registerValidation")
const registerController = require("./registerController")
const checkValidation = require("../../helper/checkValicdation")

/** @see /api/register */

router.post("/", validation.register, checkValidation, registerController.register)
router.get("/confirm", validation.confirm, checkValidation, registerController.confirm)

module.exports = router