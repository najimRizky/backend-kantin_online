const statusConfig = require("./../config/statusConfig")

const statusParser = (status) => {
    return {
        status,
        message: statusConfig[status]
    }
}

module.exports = statusParser