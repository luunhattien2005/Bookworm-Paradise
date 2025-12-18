import { describe, it, beforeEach, expect } from "vitest";
import request from "supertest";
import express from "express";
import path from "path";

let app;

describe("SMOKE TEST - Router Loads", () => {
  beforeEach(() => {
    // Initialize Express app for each test
    app = express();
    app.use(express.json());
  });

  const testRoute = async (routePath, routeFile) => {
    const router = require(path.join(process.cwd(), `backend/routes/${routeFile}`));
    app.use(routePath, router);

    const res = await request(app).get(routePath);
    expect(res.status).toBeGreaterThanOrEqual(200); // Ensure it responds
  };

  it("GET /accounts should respond (even error is OK)", async () => {
    await testRoute("/accounts", "accounts.js");
  });

  it("GET /books should respond (even error is OK)", async () => {
    await testRoute("/books", "books.js");
  });

  it("GET /carts should respond (even error is OK)", async () => {
    await testRoute("/carts", "carts.js");
  });

  it("GET /orders should respond (even error is OK)", async () => {
    await testRoute("/orders", "orders.js");
  });

  it("GET /reviews should respond (even error is OK)", async () => {
    await testRoute("/reviews", "reviews.js");
  });

  it("GET /wishlists should respond (even error is OK)", async () => {
    await testRoute("/wishlists", "wishlists.js");
  });
});