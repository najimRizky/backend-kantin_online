import moment from "moment"

const port = process.env.PORT
const projectTitle = process.env.PROJECT_TITLE

const serverListen = (server) => {
    server.listen(port, () => {
        console.log(`--- ${projectTitle} is running on port:${port} --- (${moment().format("DD/MMM hh:mm:ss A")})`)
    })
}

export default serverListen