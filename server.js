require("dotenv").config()

const express = require('express')
const server = express()
const log = require ("./helper/log")
const port = process.env.PORT
const projectTitle = process.env.PROJECT_TITLE

server.get('/', (req, res) => {
    log("/")
    res.status(200).send('Welcome to Kantin UMN Rest API')
})

server.listen(port, () => {
    log(`--- ${projectTitle} is running on port:${port} ---`)
})