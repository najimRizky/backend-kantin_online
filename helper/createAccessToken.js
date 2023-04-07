import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRED = process.env.JWT_EXPIRED

const createAccessToken = (data) => {
    return jwt.sign({...data}, JWT_SECRET, {expiresIn: JWT_EXPIRED})
}

export default createAccessToken