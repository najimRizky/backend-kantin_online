import express from "express"
import customerValidation from "./customerValidation.js"
import customerController from "./customerController.js"
import checkValidation from "../../helper/checkValidation.js"
import requireAuth from "../../validation/requireAuth.js"

const router = express.Router()

/** @see /customer */

router.use(requireAuth)

router.put(
    "/profile",
    customerValidation.uploadValidation,
    customerValidation.editProfile,
    checkValidation,
    customerController.editProfile
)

export default router