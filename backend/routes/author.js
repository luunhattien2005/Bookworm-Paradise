const express = require("express");
const router = express.Router();
const Author = require("../models/Author");

// GET all Authors
router.get("/", async (req, res) => {
    const authors = await Author.find();
    res.json(authors);
});

// Search authors
router.get("/search/:query", async (req, res) => {
    const q = req.params.query;
    const authors = await Author.find({
        title: { $regex: q, $options: "i" }
    });
    res.json(authors);
});

module.exports = router;
