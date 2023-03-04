require("dotenv").config()

const express = require('express')
const mongoose = require("mongoose")
const server = express()
const port = process.env.PORT
const projectTitle = process.env.PROJECT_TITLE

const responseParser = require("./helper/responseParser")

server.get('/', (_, res) => {
    return responseParser({ data: undefined, status: 401 }, res)
})

mongoose.set("strictQuery", false)
mongoose.connect(process.env.MONGO_DB_URI)
    .then(() => {
        console.log("--- DB Connected ---")
        server.listen(port, () => {
            console.log(`--- ${projectTitle} is running on port:${port} ---`)
        })
    })
    .catch(() => {
        console.log("--- DB Connection Failed ---")
        process.exit(1)
    })