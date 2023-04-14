import jwt from "jsonwebtoken"
import errorHandler from "../helper/errorHandler.js"

const requireAuth = (allowedRole = undefined) => {
    return (req, res, next) => {
        try {
            const { authorization } = req.headers

            if (!authorization) {
                throw Error("||401")
            }

            const accessToken = authorization.split(" ")[1]
            const { _id, role, email } = jwt.verify(accessToken, process.env.JWT_SECRET)

            if (allowedRole) {
                checkRole(allowedRole, role)
            }

            req.user = { _id, role, email }
            next()
        } catch (err) {
            errorHandler(err, res)
        }
    }
}

const checkRole = (allowedRole, requestedRole) => {
    if (allowedRole === requestedRole) {
        return
    } else {
        throw Error("||403")
    }
}

export default requireAuth