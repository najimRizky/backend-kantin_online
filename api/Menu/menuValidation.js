import { body, param } from "express-validator"
import multer from "multer"
import uploadConfig from "../../config/uploadConfig.js"
import responseParser from "../../helper/responseParser.js"

const uploadValidation = async (req, res, next) => {
    uploadConfig.single("image")(req, res, (err) => {
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

const addMenu = [
    body("title")
        .exists({ checkFalsy: true })
        .withMessage("Menu title is required"),
    body("description")
        .exists(),
    body("category")
        .exists(),
    body("price")
        .exists({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage("Price is required with minimum value of 0"),
    body("prep_duration")
        .exists({ checkFalsy: true })
        .withMessage("Preparation duration is required with minimum value of 1 (minute)")
]

const editMenu = [
    param("_id")
        .exists({ checkFalsy: true })
        .isMongoId()
        .withMessage("Invalid parameter"),
    ...addMenu,
]

const getDetail = [
    param("_id")
        .exists({ checkFalsy: true })
        .isMongoId()
        .withMessage("Invalid parameter")
]

const deleteMenu = [
    ...getDetail
]

const addCategory = [
    body("title")
        .exists({ checkFalsy: true })
        .withMessage("Category title is required"),
    body("description")
        .exists()
        .withMessage("Category description field is required"),
]

const editCategory = [
    param("category_id")
        .exists({ checkFalsy: true })
        .isMongoId()
        .withMessage("Invalid parameter"),
    body("title")
        .exists({ checkFalsy: true })
        .withMessage("Category title is required"),
    body("description")
        .exists()
        .withMessage("Category description field is required"),
]

export default {
    uploadValidation,
    editMenu,
    addMenu,
    getDetail,
    deleteMenu,
    addCategory,
    editCategory
}