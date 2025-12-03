const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// GET all carts
router.get("/", async (req, res) => {
    const carts = await Cart.find();
    res.json(carts);
});

// Search carts
router.get("/search/:query", async (req, res) => {
    const q = req.params.query;
    const carts = await Cart.find({
        title: { $regex: q, $options: "i" }
    });
    res.json(carts);
});

module.exports = router;
