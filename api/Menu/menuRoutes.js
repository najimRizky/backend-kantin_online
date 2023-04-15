import express from "express"
import menuValidation from "./menuValidation.js"
import menuController from "./menuController.js"
import checkValidation from "../../helper/checkValidation.js"
import requireAuth from "../../validation/requireAuth.js"
import roleConfig from "../../config/roleConfig.js"

const router = express.Router()

/** @see /menu */

/** @GET_SINGLE_MENU */
router.get(
    "/:_id",
    menuValidation.getDetail,
    checkValidation,
    menuController.getDetail
)

/** @ADD_MENU */
router.post(
    "/",
    requireAuth(roleConfig.tenant),
    menuValidation.uploadValidation,
    menuValidation.addMenu,
    checkValidation,
    menuController.addMenu,
)

/** @EDIT_MENU */
router.put(
    "/:_id",
    requireAuth(roleConfig.tenant),
    menuValidation.uploadValidation,
    menuValidation.editMenu,
    checkValidation,
    menuController.editMenu
)

/** @DELETE_MENU */
router.delete(
    "/:_id",
    requireAuth(roleConfig.tenant),
    menuValidation.deleteMenu,
    checkValidation,
    menuController.deleteMenu
)

/** @ADD_CATEGORY_MENU */
router.post(
    "/category",
    requireAuth(roleConfig.tenant),
    menuValidation.addCategory,
    checkValidation,
    menuController.addCategory
)

/** @GET_CATEGORY_MENU */
router.get(
    "/category",
    requireAuth(roleConfig.tenant),
    menuController.getAllCategory,
)

/** @EDIT_CATEGORY_MENU */
router.put(
    "/category/:category_id",
    menuValidation.editCategory,
    checkValidation,
    menuController.editCategory,
)

export default router