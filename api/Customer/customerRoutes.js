import express from "express"
import customerValidation from "./customerValidation.js"
import customerController from "./customerController.js"
import checkValidation from "../../helper/checkValidation.js"
import requireAuth from "../../validation/requireAuth.js"
import checkRole from "../../validation/checkRole.js"
import roleConfig from "../../config/roleConfig.js"

const router = express.Router()

/** @see /customer */

router.use(requireAuth)
router.use(checkRole(roleConfig.customer))

router.get(
    "/profile",
    customerController.getProfile
)

router.post(
    "/balance",
    customerValidation.updateBalance,
    checkValidation,
    customerController.updateBalance,
)

router.put(
    "/profile",
    customerValidation.uploadValidation,
    customerValidation.editProfile,
    checkValidation,
    customerController.editProfile
)
export default router