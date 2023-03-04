const statusParser = require("./statusParser")

const responseParser = ({status = 200, data = undefined, error = undefined, message = undefined}, res) => {
    return res.status(status).send({
        ...statusParser(status, message),
        data,
        error
    })
}

module.exports = responseParser