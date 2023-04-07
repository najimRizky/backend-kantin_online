import jwt from "jsonwebtoken"
import responseParser from "../helper/responseParser.js"

const requireAuth = async (req, res, next) => {
    try {
        const { authorization } = req.headers

        if (!authorization) {
            throw Error
        }

        const accessToken = authorization.split(" ")[1]

        const { _id, role, email } = jwt.verify(accessToken, process.env.JWT_SECRET)
        req.user = { _id, role, email }
        next()
    } catch (_) {
        return responseParser({ status: 401 }, res)
    }
}

export default requireAuth