const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// GET all books
router.get("/", async (req, res) => {
    const books = await Book.find();
    res.json(books);
});

// Search books
router.get("/search/:query", async (req, res) => {
    const q = req.params.query;
    const books = await Book.find({
        title: { $regex: q, $options: "i" }
    });
    res.json(books);
});

module.exports = router;
