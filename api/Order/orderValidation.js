import { body, param } from "express-validator";


const BODY_CART_ID = body("cart_id")
    .exists({ checkFalsy: true })
    .withMessage("cart_id is required")
    .isMongoId()
    .withMessage("Invalid Cart Id");

const PARAM_ORDER_ID = param("_id")
    .exists({ checkFalsy: true })
    .withMessage("Order Id is required")
    .isMongoId()
    .withMessage("Invalid Order Id");

const createOrder = [
    BODY_CART_ID,
    body("payment_method")
        .exists({ checkFalsy: true })
        .withMessage("payment_method is required")
]

const confirmOrder = [
    PARAM_ORDER_ID
]

const rejectOrder = [
    PARAM_ORDER_ID
]

const serveOrder = [
    PARAM_ORDER_ID
]

const finishOrder = [
    PARAM_ORDER_ID
]

export default {
    createOrder,
    confirmOrder,
    rejectOrder,
    serveOrder,
    finishOrder
}