import { body } from "express-validator"
import multer from "multer"
import uploadConfig from "../../config/uploadConfig.js"
import validTenantName from "../../config/validTenantName.js"
import responseParser from "../../helper/responseParser.js"

const uploadValidation = async (req, res, next) => {
    uploadConfig.single("profile_image")(req, res, (err) => {
        try {
            if (err instanceof multer.MulterError) {
                throw Error("File is too large (maximum 2MB) / invalid input")
            } else if (err) {
                throw Error("File not supported")
            } else {
                next()
            }
        } catch (err) {
            return responseParser({ status: 400, error: err.message }, res)
        }
    })
}

const editProfile = [
    body("full_name")
        .exists({ checkFalsy: true })
        .custom((value) => {
            if (!validTenantName.test(value)) throw new Error("Invalid tenant name")
            return true
        }),
    body("description")
        .exists()
        .custom((value) => {
            if (!validTenantName.test(value)) throw new Error("Invalid description")
            return true
        }),
    body("location")
        .exists()
]

const register = [
    body("email")
        .exists({ checkFalsy: true })
        .withMessage("Email is required")
        .isEmail(),
    body("full_name")
        .exists({ checkFalsy: true })
        .withMessage("Full Name is required")
        .custom((value) => {
            if (!validTenantName.test(value)) throw new Error("Invalid Full Name")
            return true
        }),
    body("password")
        .exists({ checkFalsy: true })
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password min length")
]

export default {
    editProfile,
    uploadValidation,
    register
}