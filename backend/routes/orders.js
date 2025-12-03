const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// GET all orders
router.get("/", async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});

// Search orders
router.get("/search/:query", async (req, res) => {
    const q = req.params.query;
    const orders = await Order.find({
        title: { $regex: q, $options: "i" }
    });
    res.json(orders);
});

module.exports = router;
