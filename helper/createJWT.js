import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRED = process.env.JWT_EXPIRED

const createJWT = (_id) => {
    return jwt.sign({_id}, JWT_SECRET, {expiresIn: JWT_EXPIRED})
}

export default createJWT