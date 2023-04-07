import roleConfig from "../config/roleConfig.js"
import responseParser from "../helper/responseParser.js"

const checkRole = (role) => {
    return (req, res, next) => {
        const userRole = req.user.role

        if (userRole === role) {
            next()
        } else {
            responseParser({ status: 403 }, res)
        }
    }
}

export default checkRole