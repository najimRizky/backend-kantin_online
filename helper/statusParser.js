import statusConfig from "./../config/statusConfig.js"

const statusParser = (status, message) => {
    return {
        status,
        message: message || statusConfig[status]
    }
}

export default statusParser