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
]

const updateBalance = [
    body("amount")
        .exists({ checkFalsy: true })
        .withMessage("Amount is required")
        .isFloat({ min: 0 })
        .withMessage("Minumum amount is 0")
]

export default {
    editProfile,
    uploadValidation,
    updateBalance
}