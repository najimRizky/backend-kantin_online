const statusConfig = require("./../config/statusConfig")

const statusParser = (status, message) => {
    return {
        status,
        message: message || statusConfig[status]
    }
}

module.exports = statusParser