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

/** @GET_PROFILE_DATA */
router.get(
    "/profile",
    customerController.getProfile
)

/** @UPDATE_BALANCE */
router.post(
    "/balance",
    customerValidation.updateBalance,
    checkValidation,
    customerController.updateBalance,
)

/** @UPDATE_PROFILE */
router.put(
    "/profile",
    customerValidation.uploadValidation,
    customerValidation.editProfile,
    checkValidation,
    customerController.editProfile
)
export default router