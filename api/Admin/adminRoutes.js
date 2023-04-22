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

/** @GET_ALL_TENANT */
router.get(
    "/tenant",
    requireAuth(roleConfig.admin),
    adminController.allTenant
)

/** @GET_DETAIL_TENANT */
router.get(
    "/tenant/:_id",
    requireAuth(roleConfig.admin),
    adminController.detailTenant
)

/** @GET_ALL_CUSTOMER */
router.get(
    "/customer",
    requireAuth(roleConfig.admin),
    adminController.allCustomer
)

/** @GET_DETAIL_CUSTOMER */
router.get(
    "/customer/:_id",
    requireAuth(roleConfig.admin),
    adminController.detailCustomer
)

export default router