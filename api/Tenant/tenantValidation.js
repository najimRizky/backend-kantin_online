import { body, param } from "express-validator"
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
        .withMessage("Description field is required"),
    body("location")
        .exists()
        .withMessage("Location field is required"),
    body("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Email is not included or invalid email"),
]

const getDetail = [
    param("_id")
        .exists({ checkFalsy: true })
        .isMongoId()
        .withMessage("Invalid parameter")
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
    editProfile,
    uploadValidation,
    getDetail,
    changePassword
}