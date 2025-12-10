require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/authors", require("./routes/authors"));
app.use("/api/books", require("./routes/books"));
app.use("/api/carts", require("./routes/carts"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/tags", require("./routes/tags"));
app.use("/api/users", require("./routes/users"));

const PORT = 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));