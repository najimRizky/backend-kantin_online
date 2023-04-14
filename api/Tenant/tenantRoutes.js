import express from "express"
import tenantValidation from "./tenantValidation.js"
import tenantController from "./tenantController.js"
import checkValidation from "../../helper/checkValidation.js"
import requireAuth from "../../validation/requireAuth.js"
import roleConfig from "../../config/roleConfig.js"

const router = express.Router()

/** @see /tenant */

router.post(
    "/register",
    tenantValidation.register,
    checkValidation,
    tenantController.register
)

router.get(
    "/",
    tenantController.getAll
)

router.get(
    "/:_id",
    tenantValidation.getDetail,
    checkValidation,
    tenantController.getDetail
)

router.get(
    "/profile",
    requireAuth(roleConfig.tenant),
    tenantController.getProfile
)

router.put(
    "/profile",
    requireAuth(roleConfig.tenant),
    tenantValidation.uploadValidation,
    tenantValidation.editProfile,
    checkValidation,
    tenantController.editProfile
)
export default router