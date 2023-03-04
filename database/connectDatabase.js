const MONGO_DB_URI = process.env.MONGO_DB_URI
const serverListen = require("./../server/serverListen")

const connectDatabase = (mongoose, server) => {
    mongoose.set("strictQuery", false)
    mongoose.connect(MONGO_DB_URI)
        .then(() => {
            console.log("--- DB Connected ---")
            serverListen(server)
        })
        .catch(() => {
            console.log("--- DB Connection Failed ---")
            process.exit(1)
        })
}

module.exports = connectDatabase
