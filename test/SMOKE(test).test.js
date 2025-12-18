import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import path from "path";

// 1. MOCK MIDDLEWARE
vi.mock("../backend/middleware/authMiddleware", () => ({
  verifyToken: (req, res, next) => {
    req.user = { id: "657f12345678901234567890", role: "admin" };
    next();
  },
  verifyAdmin: (req, res, next) => next(),
}));

vi.mock("../backend/middleware/uploadMiddleware", () => ({
  single: () => (req, res, next) => next(),
  array: () => (req, res, next) => next(),
}));

// 2. MOCK MONGOOSE LOGIC
const createChainableMock = (data) => ({
  populate: vi.fn().mockReturnThis(),
  sort: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  lean: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  skip: vi.fn().mockReturnThis(),
  exec: vi.fn().mockResolvedValue(data),
  then: (resolve) => Promise.resolve(data).then(resolve),
});

const mockResult = {
  _id: "657f12345678901234567890",
  username: "test",
  items: [],
  books: [],
  save: vi.fn().mockResolvedValue(true),
};

const MockModel = vi.fn().mockImplementation(() => mockResult);
MockModel.find = vi.fn(() => createChainableMock([mockResult]));
MockModel.findOne = vi.fn(() => createChainableMock(mockResult));
MockModel.findById = vi.fn(() => createChainableMock(mockResult));
MockModel.create = vi.fn().mockResolvedValue(mockResult);
MockModel.findByIdAndUpdate = vi.fn().mockResolvedValue(mockResult);
MockModel.findOneAndUpdate = vi.fn().mockResolvedValue(mockResult);

// 3. MOCK TỪNG MODEL (Để tránh lỗi ReferenceError)
vi.mock("../backend/models/Account", () => ({ default: MockModel, __esModule: true }));
vi.mock("../backend/models/Book", () => ({ default: MockModel, __esModule: true }));
vi.mock("../backend/models/Author", () => ({ default: MockModel, __esModule: true }));
vi.mock("../backend/models/Tag", () => ({ default: MockModel, __esModule: true }));
vi.mock("../backend/models/Cart", () => ({ default: MockModel, __esModule: true }));
vi.mock("../backend/models/Order", () => ({ default: MockModel, __esModule: true }));
vi.mock("../backend/models/Review", () => ({ default: MockModel, __esModule: true }));
vi.mock("../backend/models/Wishlist", () => ({ default: MockModel, __esModule: true }));

// 4. TEST SUITE
describe("COMPLETE SMOKE TEST SUITE", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  it("Verify Account Routes", async () => {
    const router = require(path.join(process.cwd(), "backend/routes/accounts.js"));
    app.use("/accounts", router);
    const res = await request(app).post("/accounts/login").send({ username: "a", password: "b" });
    expect(res.status).toBeLessThan(500);
  });

  it("Verify Book Routes", async () => {
    const router = require(path.join(process.cwd(), "backend/routes/books.js"));
    app.use("/api", router);
    const res = await request(app).get("/api/books");
    expect(res.status).toBeLessThan(500);
  });

  it("Verify Cart & Wishlist", async () => {
    const cart = require(path.join(process.cwd(), "backend/routes/carts.js"));
    const wish = require(path.join(process.cwd(), "backend/routes/wishlists.js"));
    app.use("/c", cart);
    app.use("/w", wish);
    const resC = await request(app).get("/c");
    const resW = await request(app).get("/w");
    expect(resC.status).toBeLessThan(500);
    expect(resW.status).toBeLessThan(500);
  });

  it("Verify Order & Review", async () => {
    const ord = require(path.join(process.cwd(), "backend/routes/orders.js"));
    const rev = require(path.join(process.cwd(), "backend/routes/reviews.js"));
    app.use("/o", ord);
    app.use("/r", rev);
    const resO = await request(app).get("/o/my-orders");
    const resR = await request(app).get("/r/123/reviews");
    expect(resO.status).toBeLessThan(500);
    expect(resR.status).toBeLessThan(500);
  });
});