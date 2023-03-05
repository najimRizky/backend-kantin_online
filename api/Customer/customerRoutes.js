const express = require("express")
const registerMiddleware = require("./middleware/registerMiddleware")
const router = express.Router()

const { registerCustomer, confirmCustomer } = require("./customerController")

/** @see /api/customer */

router.post("/register", registerMiddleware, registerCustomer)
router.get("/confirm", confirmCustomer)

module.exports = router