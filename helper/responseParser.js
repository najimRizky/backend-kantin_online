const statusParser = require("./statusParser")

const responseParser = ({status = 200, data = undefined, error = undefined}, res) => {
    return res.status(status).send({
        ...statusParser(status),
        data,
        error
    })
}

module.exports = responseParser