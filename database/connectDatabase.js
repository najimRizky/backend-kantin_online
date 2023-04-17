import moment from "moment"
import { serverClose, serverListen } from "../server/serverConnection.js"
import mongoose from "mongoose"

const MONGO_DB_URI = process.env.MONGO_DB_URI

const runConnection = async () => {
    try {
        console.log(`--- Connecting to DB --- (${moment().format("DD/MMM hh:mm:ss A")})`)
        mongoose.connect(MONGO_DB_URI);
    } catch (e) {
        console.log("error")
    }
};

let serverInstance

const connectDatabase = (server) => {
    mongoose.set("strictQuery", false);
    runConnection();

    mongoose.connection.on("connected", function () {
        console.log(`--- DB Connected --- (${moment().format("DD/MMM hh:mm:ss A")})`)
        serverInstance = serverListen(server)
    });

    mongoose.connection.on("error", function () {
        setTimeout(() => {
            console.log(`--- Reconnecting to DB --- (${moment().format("DD/MMM hh:mm:ss A")}) `)
            runConnection();
        }, 1000);
        console.error(`--- FATAL ERROR | Failed to Connect to DB --- (${moment().format("DD/MMM hh:mm:ss A")})`)
    });

    mongoose.connection.on("disconnected", function () {
        serverClose(serverInstance)
        console.error(`--- FATAL ERROR | DB Disconnected --- (${moment().format("DD/MMM hh:mm:ss A")})`)
    });

    process.on("SIGINT", function () {
        mongoose.connection.close();
        serverClose(serverInstance)
        console.error(`--- DB Disconnected --- (${moment().format("DD/MMM hh:mm:ss A")})`)
        process.exit();
    });
};

export default connectDatabase