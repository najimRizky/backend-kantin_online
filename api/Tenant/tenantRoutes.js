import express from "express"
import tenantValidation from "./tenantValidation.js"
import tenantController from "./tenantController.js"
import checkValidation from "../../helper/checkValidation.js"
import requireAuth from "../../validation/requireAuth.js"
import roleConfig from "../../config/roleConfig.js"

const router = express.Router()

/** @see /tenant */

/** @REGISTER_TENANT */
router.post(
    "/register",
    tenantValidation.register,
    checkValidation,
    tenantController.register
)

/** @GET_ALL_TENANT */
router.get(
    "/",
    tenantController.getAll
)

/** @GET_DETAIL_TENANT */
router.get(
    "/:_id",
    tenantValidation.getDetail,
    checkValidation,
    tenantController.getDetail
)

/** @GET_PROFILE_TENANT */
router.get(
    "/profile",
    requireAuth(roleConfig.tenant),
    tenantController.getProfile
)

/** @UPDATE_PROFILE_TENANT */
router.put(
    "/profile",
    requireAuth(roleConfig.tenant),
    tenantValidation.editProfile,
    checkValidation,
    tenantController.editProfile
)

/** @UPDATE_PROFILE_IMAGE_TENANT */
router.put(
    "/profile-image",
    requireAuth(roleConfig.tenant),
    tenantValidation.uploadValidation,
    checkValidation,
    tenantController.editProfileImage
)

export default router