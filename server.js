require("dotenv").config()

/** @Library */ 
const express = require('express')
const mongoose = require("mongoose")

/** @Function */ 
const responseParser = require("./helper/responseParser")
const connectDatabase = require("./database/connectDatabase") 
const serverListen = require("./server/serverListen")
const requestLogger = require("./server/requestLogger")

/** @Routes */
const registerRoutes = require("./api/Register/registerRoutes")

/** @Initialization */ 
const server = express()
server.use(express.json())
requestLogger(server)

server.get('/', (_, res) => {
    return responseParser({ data: "REST API Kantin UMN", status: 200 }, res)
})
server.use("/api/register", registerRoutes)

const WITH_DB = eval(process.env.WITH_DB)
if (WITH_DB) {
    connectDatabase(mongoose, server)
} else {
    serverListen(server)
}