import moment from "moment"

const port = process.env.PORT
const projectTitle = process.env.PROJECT_TITLE

export const serverListen = (server) => {
    const connection = server.listen(port, () => {
        console.log(`--- ${projectTitle} is running on port:${port} --- (${moment().format("DD/MMM hh:mm:ss A")})`)
    })
    return connection
}

export const serverClose = (serverInstance) => {
    serverInstance.close(() => {
        console.log(`--- ${projectTitle} is stopped --- (${moment().format("DD/MMM hh:mm:ss A")})`)
    })
}
