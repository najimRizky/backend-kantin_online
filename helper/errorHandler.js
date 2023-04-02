import responseParser from "./responseParser.js"

const errorHandler = (err, res) => {
    const error = err.split(" || ")
    const message = error[0] || "An unexpected error has occurred"
    const status = error[1] || 500

    return responseParser({ 
        status: status, 
        error: message 
    }, res)
}

export default errorHandler;