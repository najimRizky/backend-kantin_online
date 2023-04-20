import express from "express"
import checkValidation from "../../helper/checkValidation.js"
import requireAuth from "../../validation/requireAuth.js"
import roleConfig from "../../config/roleConfig.js"
import adminValidation from "./adminValidation.js"
import adminController from "./adminController.js"

const router = express.Router()

/** @see /admin */

/** @REGISTER_TENANT */
router.post(
    "/tenant/register",
    requireAuth(roleConfig.admin),
    adminValidation.registerTenant,
    checkValidation,
    adminController.registerTenant
)

export default router