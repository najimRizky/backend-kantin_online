const MONGO_DB_URI = process.env.MONGO_DB_URI
const serverListen = require("./../server/serverListen")
const retry = require("retry")

const operation = retry.operation({
    retries: 5,
    minTimeout: 1 * 1000,
    maxTimeout: 1 * 1000,
    randomize: true
})

const connectDatabase = (mongoose, server) => {
    console.log("--- Connecting to DB ---")
    mongoose.set("strictQuery", false)

    operation.attempt((currentAttempt) => {
        mongoose.connect(MONGO_DB_URI, (err) => {
            if (err) {
                console.log("--- DB Connection Failed ---")
                if (operation.retry(err)) {
                    console.log(`--- Reconnecting to DB [${currentAttempt}] ---`)
                    return
                }
                console.error('--- FATAL ERROR | Failed to reconnect to DB ---')
                process.exit(1)
            } else {
                console.log("--- DB Connected ---")
                serverListen(server)
            }
        })
    })
}

module.exports = connectDatabase
