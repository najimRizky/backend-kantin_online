import "./config/loadEnv.js"

/** @Library */ 
import express from "express"
import mongoose from "mongoose"

/** @Function */ 
import responseParser from "./helper/responseParser.js"
import connectDatabase from "./database/connectDatabase.js"
import serverListen from "./server/serverListen.js"
import requestLogger from "./server/requestLogger.js" 

/** @Routes */
import uploadRoutes from "./api/Upload/uploadRoutes.js"
import customerRoutes from "./api/Customer/customerRoutes.js"
import accountRoutes from "./api/Account/accountRoutes.js"
import tenantRoutes from "./api/Tenant/tenantRoutes.js"

/** @Initialization */ 
const server = express()
server.use(express.json())
server.set('view engine', 'ejs');
server.use(requestLogger)

server.get('/', (_, res) => {
    return responseParser({ data: "REST API Kantin UMN", status: 200 }, res)
})
server.use("/upload", uploadRoutes)
server.use("/customer", customerRoutes)
server.use("/account", accountRoutes)
server.use("/tenant", tenantRoutes)

const WITH_DB = eval(process.env.WITH_DB)
if (WITH_DB) {
    connectDatabase(mongoose, server)
} else {
    serverListen(server)
}