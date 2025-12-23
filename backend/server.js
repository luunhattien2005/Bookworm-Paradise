require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./db");

const app = express();
connectDB();
//console.log("JWT_SECRET:", process.env.JWT_SECRET);
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/accounts", require("./routes/accounts"));
app.use("/api", require("./routes/books"));  // Vì bên trong routes/books.js đã có sẵn /books, /tags, /authors
app.use("/api/carts", require("./routes/carts"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/wishlists", require("./routes/wishlists"));

const PORT = 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));