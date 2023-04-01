import responseParser from "./responseParser.js"

const errorHandler = (err, res) => {
    return responseParser({ 
        status: err.status || 500, 
        error: err.message || "Internal Server Error" 
    }, res)
}

export default errorHandler;