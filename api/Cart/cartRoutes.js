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

/** @ADD_ITEM */
router.post(
    "/:tenant_id",
    cartValidation.addItem,
    checkValidation,
    cartController.addItem
)

/** @UPDATE_ITEM */
router.patch(
    "/:tenant_id",
    cartValidation.updateItem,
    checkValidation,
    cartController.updateItem
)

/** @REMOVE_ITEM */
router.delete(
    "/:tenant_id",
    cartValidation.removeItem,
    checkValidation,
    cartController.removeItem
)

/** @CLEAR_CART */
router.delete(
    "/clear/:tenant_id",
    cartValidation.clearCart,
    checkValidation,
    cartController.clearCart
)

/** @GET_SINGLE_CART */
router.get(
    "/:tenant_id",
    cartValidation.getCart,
    checkValidation,
    cartController.getCart
)

/** @GET_ALL_CART */
router.get(
    "/",
    cartController.getAllCart
)

export default router