const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect("mongodb+srv://thuong:thuong@cluster0.w0qlgsj.mongodb.net/?appName=Cluster0");
        console.log("MongoDB connected");
    } catch (error) {
        console.error("DB connection failed:", error);
    }
}

module.exports = connectDB;

