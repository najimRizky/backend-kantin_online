import express from "express"
import menuValidation from "./menuValidation.js"
import menuController from "./menuController.js"
import checkValidation from "../../helper/checkValidation.js"
import requireAuth from "../../validation/requireAuth.js"
import roleConfig from "../../config/roleConfig.js"
import checkRole from "../../validation/checkRole.js"

const router = express.Router()

/** @see /menu */

router.get(
    "/:_id",
    menuValidation.getDetail,
    checkValidation,
    menuController.getDetail
)

router.use(requireAuth)
router.use(checkRole(roleConfig.tenant))

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