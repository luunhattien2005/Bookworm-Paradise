const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// GET all reviews
router.get("/", async (req, res) => {
    const reviews = await Review.find();
    res.json(reviews);
});

// Search reviews
router.get("/search/:query", async (req, res) => {
    const q = req.params.query;
    const reviews = await Review.find({
        title: { $regex: q, $options: "i" }
    });
    res.json(reviews);
});

module.exports = router;
