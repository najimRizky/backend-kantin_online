import express from "express"
import otherController from "./otherController.js"
const router = express.Router()

router.get("/search", otherController.search)

router.get("/random-menu", otherController.randomMenu)

router.get("/random-tenant", otherController.randomTenant)

export default router