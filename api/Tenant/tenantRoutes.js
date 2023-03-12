import express from "express"
import tenantValidation from "./tenantValidation.js"
import tenantController from "./tenantController.js"
import checkValidation from "../../helper/checkValidation.js"
import requireAuth from "../../validation/requireAuth.js"

const router = express.Router()

/** @see /tenant */

router.post(
    "/register",
    tenantValidation.register,
    checkValidation,
    tenantController.register
)

router.use(requireAuth)

router.get(
    "/profile",
    tenantController.getProfile
)

router.put(
    "/profile",
    tenantValidation.uploadValidation,
    tenantValidation.editProfile,
    checkValidation,
    tenantController.editProfile
)
export default router