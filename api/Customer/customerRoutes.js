import express from "express"
import customerValidation from "./customerValidation.js"
import customerController from "./customerController.js"
import checkValidation from "../../helper/checkValidation.js"
import requireAuth from "../../validation/requireAuth.js"
import roleConfig from "../../config/roleConfig.js"

const router = express.Router()

/** @see /customer */


/** @GET_PROFILE_DATA */
router.get(
    "/profile",
    requireAuth(roleConfig.customer),
    customerController.getProfile    
)

/** @UPDATE_BALANCE */
router.patch(
    "/balance",
    requireAuth(roleConfig.customer),
    customerValidation.updateBalance,    
    checkValidation,
    customerController.updateBalance,
)

/** @UPDATE_PROFILE */
router.put(
    "/profile",
    requireAuth(roleConfig.customer),
    customerValidation.editProfile,
    checkValidation,
    customerController.editProfile
)

/** @UPDATE_PROFILE_IMAGE */
router.put(
    "/profile-image",
    requireAuth(roleConfig.customer),
    customerValidation.uploadValidation,    
    checkValidation,
    customerController.editProfileImage
)

/** @UPDATE_PROFILE_IMAGE */
router.put(
    "/change-password",
    requireAuth(roleConfig.customer),
    customerValidation.changePassword,
    checkValidation,
    customerController.changePassword
)
export default router