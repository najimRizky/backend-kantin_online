import { body, param } from "express-validator"

const PARAM_TENANT_ID = param("tenant_id")
    .exists({ checkFalsy: true })
    .withMessage("Tenant_id is required")
    .isMongoId()
    .withMessage("Invalid Tenant Id")

const BODY_MENU_ID = body("menu_id")
    .exists({ checkFalsy: true })
    .withMessage("Menu_id is required")
    .isMongoId()
    .withMessage("Invalid Menu Id")


const addItem = [
    PARAM_TENANT_ID,
    BODY_MENU_ID,
    body("quantity")
        .exists({ checkFalsy: true })
        .withMessage("Quantity is required")
        .isInt({ min: 1 })
        .withMessage("Minimum quantity is 1"),
]

const updateItem = [
    PARAM_TENANT_ID,
    BODY_MENU_ID,
    body("quantity")
        .exists()
        .withMessage("Quantity is required")
        .isInt({ min: 0 })
        .withMessage("Minimum quantity is 0"),
]

const removeItem = [
    PARAM_TENANT_ID,
    BODY_MENU_ID,
]

const clearCart = [
    PARAM_TENANT_ID
]

const getCart = [
    PARAM_TENANT_ID
]

export default {
    addItem,
    updateItem,
    removeItem,
    clearCart,
    getCart,
}