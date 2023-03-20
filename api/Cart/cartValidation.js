import { body, query } from "express-validator"

const addCart = [
    body("tenant_id")
        .exists({ checkFalsy: true })
        .withMessage("Tenant is required")
        .isMongoId()
        .withMessage("Invalid Id"),
    body("menu_id")
        .exists({ checkFalsy: true })
        .withMessage("Menu")
        .isMongoId()
        .withMessage("Invalid Id"),
    body("quantity")
        .exists({ checkFalsy: true })
        .isInt({ min: 1 })
        .withMessage("Quantity is required with minimum quantity is 1")
]

const subtractCart = [
    body("tenant_id")
        .exists({ checkFalsy: true })
        .withMessage("Tenant is required")
        .isMongoId()
        .withMessage("Invalid Id"),
    body("menu_id")
        .exists({ checkFalsy: true })
        .withMessage("Menu")
        .isMongoId()
        .withMessage("Invalid Id"),
    body("quantity")
        .exists({ checkFalsy: true })
        .isInt({ min: 1 })
        .withMessage("Quantity is required with minimum quantity is 1")
]

const deleteCart = [
    body("tenant_id")
        .exists({ checkFalsy: true })
        .withMessage("Tenant is required")
        .isMongoId()
        .withMessage("Invalid Id"),
]

export default {
    addCart,
    subtractCart,
    deleteCart,
}