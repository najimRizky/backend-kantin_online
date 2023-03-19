import express from "express"
import otherController from "./otherController.js"
const router = express.Router()

router.get("/search", otherController.search)

export default router