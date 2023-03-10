import statusParser from "./statusParser.js"

const responseParser = ({status = 200, data = undefined, error = undefined, message = undefined}, res) => {
    return res.status(status).send({
        ...statusParser(status, message),
        data,
        error
    })
}

export default responseParser