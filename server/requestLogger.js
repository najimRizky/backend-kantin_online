const requestLogger = (server) => {
    server.use((req, _, next) => {
        console.log(req.path, req.method)
        next()
    })
}

export default requestLogger