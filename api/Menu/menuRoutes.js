import express from "express"
import menuValidation from "./menuValidation.js"
import menuController from "./menuController.js"
import checkValidation from "../../helper/checkValidation.js"
import requireAuth from "../../validation/requireAuth.js"

const router = express.Router()

/** @see /menu */

router.get(
    "/:_id",
    menuValidation.getDetail,
    checkValidation,
    menuController.getDetail
)

router.use(requireAuth)

router.post(
    "/",
    menuValidation.uploadValidation,
    menuValidation.addMenu,
    checkValidation,
    menuController.addMenu,
)

router.put(
    "/:_id",
    menuValidation.uploadValidation,
    menuValidation.editMenu,
    checkValidation,
    menuController.editMenu
)

export default router