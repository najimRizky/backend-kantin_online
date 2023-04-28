import express from "express"
import checkValidation from "../../helper/checkValidation.js"
import requireAuth from "../../validation/requireAuth.js"
import orderValidation from "./orderValidation.js"
import orderController from "./orderController.js"
import roleConfig from "../../config/roleConfig.js"

const router = express.Router()

/** @see /order */

/** @CREATE_ORDER */
router.post(
    "/create",
    requireAuth(roleConfig.customer),
    orderValidation.createOrder,
    checkValidation,
    orderController.createOrder
)

/** @CONFIRM_ORDER */
router.patch(
    "/confirm/:_id",
    requireAuth(roleConfig.tenant),
    orderValidation.confirmOrder,
    checkValidation,
    orderController.confirmOrder
)

/** @REJECT_ORDER */
router.patch(
    "/reject/:_id",
    requireAuth(roleConfig.tenant),
    orderValidation.rejectOrder,
    checkValidation,
    orderController.rejectOrder
)

/** @SERVE_ORDER */
router.patch(
    "/serve/:_id",
    requireAuth(roleConfig.tenant),
    orderValidation.serveOrder,
    checkValidation,
    orderController.serveOrder
)

/** @FINISH_ORDER */
router.patch(
    "/finish/:_id",
    requireAuth(roleConfig.tenant),
    orderValidation.finishOrder,
    checkValidation,
    orderController.finishOrder
)

/** @GET_ALL_ON_PROGRESS_ORDER */
router.get(
    "/on-progress",
    requireAuth(),
    orderController.getAllOnProgressOrder
)

/** @GET_ALL_COMPLETED_ORDER */
router.get(
    "/completed",
    requireAuth(),
    orderController.getAllCompletedOrder
)

/** @GET_SINGLE_ORDER */
router.get(
    "/:_id",
    requireAuth(),
    orderValidation.getSingleOrder,
    checkValidation,
    orderController.getSingleOrder
)

/** @ADD_ORDER_REVIEW */
router.post(
    "/review/:_id",
    requireAuth(roleConfig.customer),
    orderValidation.addReview,
    checkValidation,
    orderController.addReview
)


export default router