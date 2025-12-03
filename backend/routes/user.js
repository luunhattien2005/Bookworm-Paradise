const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET all users
router.get("/", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// Search users
router.get("/search/:query", async (req, res) => {
    const q = req.params.query;
    const users = await User.find({
        title: { $regex: q, $options: "i" }
    });
    res.json(users);
});

module.exports = router;
