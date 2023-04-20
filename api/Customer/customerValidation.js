import { body } from "express-validator"
import multer from "multer"
import uploadConfig from "../../config/uploadConfig.js"
import validFullName from "../../config/validFullName.js"
import responseParser from "../../helper/responseParser.js"

const uploadValidation = async (req, res, next) => {
    uploadConfig.single("profile_image")(req, res, (err) => {
        try {
            if (err instanceof multer.MulterError) {
                throw Error("File is too large, maximum 2MB")
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
            if (!validFullName.test(value)) throw new Error("Invalid Full Name")
            return true
        }),
    body("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Email is not included or invalid email"),
]

const updateBalance = [
    body("amount")
        .exists({ checkFalsy: true })
        .withMessage("Amount is required")
        .isFloat({ min: 0 })
        .withMessage("Minumum amount is 0")
]

const changePassword = [
    body("password")
        .exists({ checkFalsy: true })
        .withMessage("Password must be included"),
    body("new_password")
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage("New password must be included with at least 6 characters long."),
    body("confirm_new_password")
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage("Confirm new password must be included with at least 6 characters long."),
]

export default {
    uploadValidation,
    editProfile,
    updateBalance,
    changePassword
}