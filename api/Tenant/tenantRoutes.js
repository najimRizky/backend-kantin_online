import express from "express"
import tenantValidation from "./tenantValidation.js"
import tenantController from "./tenantController.js"
import checkValidation from "../../helper/checkValidation.js"
import requireAuth from "../../validation/requireAuth.js"
import roleConfig from "../../config/roleConfig.js"

const router = express.Router()

/** @see /tenant */

/** @GET_ALL_TENANT */
router.get(
    "/",
    tenantController.getAll
)

/** @TENANT_HOME_DASHBOARD */
router.get(
    "/dashboard",
    requireAuth(roleConfig.tenant),
    tenantController.dashboard
)

/** @GET_PROFILE_TENANT */
router.get(
    "/profile",
    requireAuth(roleConfig.tenant),
    tenantController.getProfile
)

/** @GET_ALL_TENANT_REVIEW */
router.get(
    "/review",
    requireAuth(roleConfig.tenant),
    tenantController.getAllPreview
)

/** @GET_ALL_TENANT_MENU */
router.get(
    "/menu",
    requireAuth(roleConfig.tenant),
    tenantController.getAllMenu
)

/** @GET_DETAIL_TENANT */
router.get(
    "/:_id",
    tenantValidation.getDetail,
    checkValidation,
    tenantController.getDetail
)

/** @EDIT_PROFILE_TENANT */
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

/** @UPDATE_PASSWORD_TENANT */
router.put(
    "/change-password",
    requireAuth(roleConfig.tenant),
    tenantValidation.changePassword,
    checkValidation,
    tenantController.changePassword
)

export default router