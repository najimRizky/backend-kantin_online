import roleConfig from "../config/roleConfig.js"
import responseParser from "../helper/responseParser.js"

const checkRole = (role) => {
    return (req, res, next) => {
        const userRole = req.user.role

        if (userRole === role || userRole === roleConfig.admin) {
            next()
        } else {
            responseParser({ status: 401 }, res)
        }
    }
}

export default checkRole