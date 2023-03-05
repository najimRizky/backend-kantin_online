const express = require("express")
const router = express.Router()
const customerValidation = require("./customerValidation")

const customerController = require("./customerController")
const checkValidation = require("../../helper/checkValicdation")

/** @see /api/customer */


module.exports = router