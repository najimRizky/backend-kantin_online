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
import registerRoutes from "./api/Register/registerRoutes.js"
import loginRoutes from "./api/Login/loginRoutes.js"
import uploadRoutes from "./api/Upload/uploadRoutes.js"
import customerRoutes from "./api/Customer/customerRoutes.js"

/** @Initialization */ 
const server = express()
server.use(express.json())
requestLogger(server)

server.get('/', (_, res) => {
    return responseParser({ data: "REST API Kantin UMN", status: 200 }, res)
})
server.use("/register", registerRoutes)
server.use("/login", loginRoutes)
server.use("/upload", uploadRoutes)
server.use("/customer", customerRoutes)

const WITH_DB = eval(process.env.WITH_DB)
if (WITH_DB) {
    connectDatabase(mongoose, server)
} else {
    serverListen(server)
}