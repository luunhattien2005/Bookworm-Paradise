const mongoose = require("mongoose");
require("dotenv").config();

const mongoDB = process.env.MONGODB_URI;


async function connectDB() {
    try {
        await mongoose.connect(mongoDB);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("DB connection failed:", error);
    }
}

module.exports = connectDB;

