import moment from "moment"

const requestLogger = (req, _, next) => {
    const log = `${req.method} ${req.path} (${moment().format("DD/MMM hh:mm:ss A")})`
    console.log(log)
    next()
}

export default requestLogger