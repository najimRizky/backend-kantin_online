import express from "express"
import menuValidation from "./menuValidation.js"
import menuController from "./menuController.js"
import checkValidation from "../../helper/checkValidation.js"
import requireAuth from "../../validation/requireAuth.js"
import roleConfig from "../../config/roleConfig.js"
import checkRole from "../../validation/checkRole.js"

const router = express.Router()

/** @see /menu */

/** @GET_SINGLE_MENU */
router.get(
    "/:_id",
    menuValidation.getDetail,
    checkValidation,
    menuController.getDetail
)

router.use(requireAuth)
router.use(checkRole(roleConfig.tenant))

/** @ADD_MENU */
router.post(
    "/",
    menuValidation.uploadValidation,
    menuValidation.addMenu,
    checkValidation,
    menuController.addMenu,
)

/** @EDIT_MENU */
router.put(
    "/:_id",
    menuValidation.uploadValidation,
    menuValidation.editMenu,
    checkValidation,
    menuController.editMenu
)

/** @DELETE_MENU */
router.delete(
    "/:_id",
    menuValidation.deleteMenu,
    checkValidation,
    menuController.deleteMenu
)

export default router