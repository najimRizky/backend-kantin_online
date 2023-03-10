import express from "express"
import customerValidation from "./customerValidation.js"
import customerController from "./customerController.js"
import checkValidation from "../../helper/checkValidation.js"

const router = express.Router()

/** @see /api/customer */

export default router