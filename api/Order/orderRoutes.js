import express from "express"
import checkValidation from "../../helper/checkValidation.js"
import requireAuth from "../../validation/requireAuth.js"
import orderValidation from "./orderValidation.js"
import orderController from "./orderController.js"
import checkRole from "../../validation/checkRole.js"
import roleConfig from "../../config/roleConfig.js"

const router = express.Router()

/** @see /order */

router.use(requireAuth)

/** @CREATE_ORDER */
router.post(
    "/create",
    checkRole(roleConfig.customer),
    orderValidation.createOrder,
    checkValidation,
    orderController.createOrder
)

/** @CONFIRM_ORDER */
router.patch(
    "/confirm/:_id",
    checkRole(roleConfig.tenant),
    orderValidation.confirmOrder,
    checkValidation,
    orderController.confirmOrder
)

/** @REJECT_ORDER */
router.patch(
    "/reject/:_id",
    checkRole(roleConfig.tenant),
    orderValidation.rejectOrder,
    checkValidation,
    orderController.rejectOrder
)

/** @SERVE_ORDER */
router.patch(
    "/serve/:_id",
    checkRole(roleConfig.tenant),
    orderValidation.serveOrder,
    checkValidation,
    orderController.serveOrder
)

/** @FINISH_ORDER */
router.patch(
    "/finish/:_id",
    checkRole(roleConfig.tenant),
    orderValidation.finishOrder,
    checkValidation,
    orderController.finishOrder
)

export default router