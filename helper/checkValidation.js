import { validationResult } from "express-validator"
import responseParser from "./responseParser.js"

const checkValidation = (req, res, next) => {
    const errors = validationResult(req)
    const onlyFirstError = req.onlyFirstError || false
    if(!errors.isEmpty()){
        return responseParser({status: 400, error: errors.array({onlyFirstError: onlyFirstError})}, res)
    }
    next()
}

export default checkValidation