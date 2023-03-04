const express = require("express")
const registerMiddleware = require("./middleware/registerMiddleware")
const router = express.Router()

const { registerCustomer } = require("./customerController")

/** @see /api/customer */

router.post("/register", registerMiddleware, registerCustomer)

module.exports = router