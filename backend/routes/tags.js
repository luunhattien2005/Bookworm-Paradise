const express = require("express");
const router = express.Router();
const Tag = require("../models/Tag");

// GET all tags
router.get("/", async (req, res) => {
    const tags = await Tag.find();
    res.json(tags);
});

// Search tags
router.get("/search/:query", async (req, res) => {
    const q = req.params.query;
    const tags = await Tag.find({
        title: { $regex: q, $options: "i" }
    });
    res.json(tags);
});

module.exports = router;
