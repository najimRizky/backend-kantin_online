require("dotenv").config()

/** @Library */ 
const express = require('express')
const mongoose = require("mongoose")


/** @Initialization */ 
const server = express()

/** @Function */ 
const responseParser = require("./helper/responseParser")
const connectDatabase = require("./database/connectDatabase") 
const serverListen = require("./server/serverListen")

/** @Routes */
const customerRoutes = require("./api/Customer/customerRoutes")

server.get('/', (_, res) => {
    return responseParser({ data: "REST API Kantin UMN", status: 200 }, res)
})
server.use("/api/customer", customerRoutes)


connectDatabase(mongoose, server)
// serverListen(server)