const express = require("express")
const router = express.Router()
const customerValidation = require("./customerValidation")

const { registerCustomer, confirmCustomer } = require("./customerController")
const checkValidation = require("../../helper/checkValicdation")

/** @see /api/customer */

router.post("/register", customerValidation.register, checkValidation, registerCustomer)
router.get("/confirm", confirmCustomer)

module.exports = router