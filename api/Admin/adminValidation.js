import { body } from "express-validator";
import validTenantName from "../../config/validTenantName.js";

const registerTenant = [
    body("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Email is not included or invalid email"),
    body("full_name")
        .exists({ checkFalsy: true })
        .custom((value) => {
            if (!validTenantName.test(value)) throw new Error("Full name is not included or invalid full name")
            return true
        }),
    body("description")
        .exists()
        .withMessage("Description field is required"),
    body("location")
        .exists()
        .withMessage("Location field is required"),
    body("password")
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage("Password must be included with at least 6 characters long")
]

export default {
    registerTenant
}