const mongoose = require("mongoose");

const Schema = mongoose.Schema

const statusModel = new Schema({
    title: {
        type: String,
        required: true,
    },
}, { timestamps: true })

module.exports = mongoose.model("Status", statusModel)