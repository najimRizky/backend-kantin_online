import moment from "moment"
import serverListen from "./../server/serverListen.js"
import retry from "retry"
import mongoose from "mongoose"

const MONGO_DB_URI = process.env.MONGO_DB_URI

const operation = retry.operation({
    retries: 5,
    maxTimeout: 1 * 1000,
    randomize: true
})

const connectDatabase = (server) => {
    console.log(`--- Connecting to DB --- (${moment().format("DD/MMM hh:mm:ss A")})`)
    mongoose.set("strictQuery", false)

    operation.attempt((currentAttempt) => {
        mongoose.connect(MONGO_DB_URI, (err) => {
            if (err) {
                console.log(`--- DB Connection Failed --- (${moment().format("DD/MMM hh:mm:ss A")})`)
                if (operation.retry(err)) {
                    console.log(`--- Reconnecting to DB [${currentAttempt}] --- (${moment().format("DD/MMM hh:mm:ss A")}) `)
                    return
                }
                console.error(`--- FATAL ERROR | Failed to reconnect to DB --- (${moment().format("DD/MMM hh:mm:ss A")})`)
                process.exit(1)
            } else {
                console.log(`--- DB Connected --- (${moment().format("DD/MMM hh:mm:ss A")})`)
                serverListen(server)
            }
        })
    })
}

export default connectDatabase