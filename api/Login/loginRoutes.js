const express = require("express")
const router = express.Router()

const loginvalidation = require("./loginValidation")
const loginController = require("./loginController")
const checkValidation = require("../../helper/checkValicdation")

/** @see /api/login */

router.post("/", loginvalidation.login, checkValidation, loginController.login)

module.exports = router