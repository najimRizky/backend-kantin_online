import { body, param } from "express-validator"

const TENANT_ID = body("tenant_id")
    .exists({ checkFalsy: true })
    .withMessage("Tenant_id is required")
    .isMongoId()
    .withMessage("Invalid Tenant Id")


const MENU_ID = body("menu_id")
    .exists({ checkFalsy: true })
    .withMessage("Menu_id is required")
    .isMongoId()
    .withMessage("Invalid Menu Id")


const QUANTITY = body("quantity")
    .exists({ checkFalsy: true })
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Minimum quantity is 1")


const CART_ID = [
    param("_id")
        .exists({ checkFalsy: true })
        .withMessage("Cart Id is required")
        .isMongoId()
        .withMessage("Invalid Cart Id"),
]

const addItem = [
    TENANT_ID,
    MENU_ID,
    QUANTITY,
]

const updateItem = [
    CART_ID,
    TENANT_ID,
    MENU_ID,
    QUANTITY,
]

const removeItem = [
    CART_ID,
    TENANT_ID,
    MENU_ID,
]

const clearCart = [
    CART_ID,
]

const getCart = [
    CART_ID,
]

export default {
    addItem,
    updateItem,
    removeItem,
    clearCart,
    getCart,
}