import express from "express"
import cartValidation from "./cartValidation.js"
import cartController from "./cartController.js"
import checkValidation from "../../helper/checkValidation.js"
import requireAuth from "../../validation/requireAuth.js"
import roleConfig from "../../config/roleConfig.js"

const router = express.Router()

/** @see /cart */


/** @ADD_ITEM */
router.post(
    "/:tenant_id",
    requireAuth(roleConfig.customer),
    cartValidation.addItem,
    checkValidation,
    cartController.addItem
)

/** @UPDATE_ITEM */
router.patch(
    "/:tenant_id",
    requireAuth(roleConfig.customer),
    cartValidation.updateItem,
    checkValidation,
    cartController.updateItem
)

/** @REMOVE_ITEM */
router.delete(
    "/:tenant_id",
    requireAuth(roleConfig.customer),
    cartValidation.removeItem,
    checkValidation,
    cartController.removeItem
)

/** @CLEAR_CART */
router.delete(
    "/clear/:tenant_id",
    requireAuth(roleConfig.customer),
    cartValidation.clearCart,
    checkValidation,
    cartController.clearCart
)

/** @GET_SINGLE_CART */
router.get(
    "/:tenant_id",
    requireAuth(roleConfig.customer),
    cartValidation.getCart,
    checkValidation,
    cartController.getCart
)

/** @GET_ALL_CART */
router.get(
    "/",
    requireAuth(roleConfig.customer),
    cartController.getAllCart
)

export default router