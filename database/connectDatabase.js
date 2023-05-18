import moment from "moment"
import { serverClose, serverListen } from "../server/serverConnection.js"
import mongoose from "mongoose"

const MONGO_DB_URI = process.env.MONGO_DB_URI

const runConnection = async () => {
    try {
        console.log(`--- Connecting to DB --- (${moment().format("DD/MMM hh:mm:ss A")})`)
        await mongoose.connect(MONGO_DB_URI);
    } catch (err) {
        console.log("--- Connecting failed")
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
        console.error(`--- FATAL ERROR | Failed to Connect to DB --- (${moment().format("DD/MMM hh:mm:ss A")})`)
        setTimeout(() => {
            console.log(`--- Reconnecting to DB --- (${moment().format("DD/MMM hh:mm:ss A")}) `)
            runConnection();
        }, 1000);
    });

    mongoose.connection.on("disconnected", function () {
        console.error(`--- FATAL ERROR | DB Disconnected --- (${moment().format("DD/MMM hh:mm:ss A")})`)
        if (serverInstance !== undefined) {
            serverClose(serverInstance)
            serverInstance = undefined
        }
    });

    process.on("SIGINT", function () {
        mongoose.connection.close();
        serverClose(serverInstance)
        console.error(`--- DB Disconnected --- (${moment().format("DD/MMM hh:mm:ss A")})`)
        process.exit();
    });
    
    process.on("SIGTERM", function () {
        mongoose.connection.close();
        serverClose(serverInstance)
        console.error(`--- DB Disconnected --- (${moment().format("DD/MMM hh:mm:ss A")})`)
        process.exit();
    });
};

export default connectDatabase