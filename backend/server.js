const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/books", require("./routes/books"));

const PORT = 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));