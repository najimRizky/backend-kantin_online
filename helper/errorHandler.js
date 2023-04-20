import responseParser from "./responseParser.js"

const errorHandler = (err, res) => {
    const customError = err.message?.includes("||") 

    const error = customError ? err.message.split("||") : err.message
    
    const status = customError ? Number(error[1] || 500) : 500
    const message = customError ? (error[0] || undefined) : error

    return responseParser({ 
        status: status, 
        error: message 
    }, res)
}

export default errorHandler;