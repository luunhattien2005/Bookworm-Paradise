import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import path from "path";

describe("SMOKE TEST - router loads", () => {
  it("GET /accounts should respond (even error is OK)", async () => {
    const app = express();
    app.use(express.json());

    const router = require(path.join(
      process.cwd(),
      "backend/routes/accounts.js"
    ));

    app.use("/accounts", router);

    const res = await request(app).get("/accounts");

    expect(res.status).toBeGreaterThanOrEqual(200);
  });
});

describe("SMOKE TEST - router loads", () => {
  it("GET /books should respond (even error is OK)", async () => {
    const app = express();
    app.use(express.json());

    const router = require(path.join(
      process.cwd(),
      "backend/routes/books.js"
    ));

    app.use("/books", router);

    const res = await request(app).get("/books");

    expect(res.status).toBeGreaterThanOrEqual(200);
  });
});

describe("SMOKE TEST - router loads", () => {
  it("GET /carts should respond (even error is OK)", async () => {
    const app = express();
    app.use(express.json());

    const router = require(path.join(
      process.cwd(),
      "backend/routes/carts.js"
    ));

    app.use("/csrts", router);

    const res = await request(app).get("/carts");

    expect(res.status).toBeGreaterThanOrEqual(200);
  });
});

describe("SMOKE TEST - router loads", () => {
  it("GET /orders should respond (even error is OK)", async () => {
    const app = express();
    app.use(express.json());

    const router = require(path.join(
      process.cwd(),
      "backend/routes/orders.js"
    ));

    app.use("/orders", router);

    const res = await request(app).get("/orders");

    expect(res.status).toBeGreaterThanOrEqual(200);
  });
});

describe("SMOKE TEST - router loads", () => {
  it("GET /reviews should respond (even error is OK)", async () => {
    const app = express();
    app.use(express.json());

    const router = require(path.join(
      process.cwd(),
      "backend/routes/reviews.js"
    ));

    app.use("/reviews", router);

    const res = await request(app).get("/reviews");

    expect(res.status).toBeGreaterThanOrEqual(200);
  });
});

describe("SMOKE TEST - router loads", () => {
  it("GET /wishlists should respond (even error is OK)", async () => {
    const app = express();
    app.use(express.json());

    const router = require(path.join(
      process.cwd(),
      "backend/routes/wishlists.js"
    ));

    app.use("/wishlists", router);

    const res = await request(app).get("/wishlists");

    expect(res.status).toBeGreaterThanOrEqual(200);
  });
});