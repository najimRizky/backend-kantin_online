import express from "express"
import checkValidation from "../../helper/checkValidation.js"
import requireAuth from "../../validation/requireAuth.js"
import orderValidation from "./orderValidation.js"
import orderController from "./orderController.js"

const router = express.Router()

/** @see /order */

// router.use(requireAuth)

router.post(
    "/create",
    orderValidation.createOrder,
    checkValidation,
    orderController.createOrder
)

router.patch(
    "/confirm/:_id",
    orderValidation.confirmOrder,
    checkValidation,
    orderController.confirmOrder
)

export default router