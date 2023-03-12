const requestLogger = (req, _, next) => {
    console.log(req.path, req.method)
    next()
}

export default requestLogger