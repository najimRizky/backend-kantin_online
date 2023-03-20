import express from "express"
import cartValidation from "./cartValidation.js"
import cartController from "./cartController.js"
import checkValidation from "../../helper/checkValidation.js"
import requireAuth from "../../validation/requireAuth.js"
import checkRole from "../../validation/checkRole.js"
import roleConfig from "../../config/roleConfig.js"

const router = express.Router()

/** @see /cart */

router.use(requireAuth)
router.use(checkRole(roleConfig.customer))

router.post(
    "/add",
    cartValidation.addCart,
    checkValidation,
    cartController.addCart
)

router.post(
    "/subtract",
    cartValidation.subtractCart,
    checkValidation,
    cartController.subtractCart
)

router.delete(
    "/delete",
    cartValidation.deleteCart,
    checkValidation,
    cartController.deleteCart
)