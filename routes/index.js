const express = require("express");
const { getDb } = require("../db");

const router = express.Router();

router.get("/", (_req, res, next) => {
  try {
    const db = getDb();
    const books = db.prepare("SELECT id, title, author, price, cover_url FROM books ORDER BY title").all();
    res.render("index", { title: "Browse Books", books });
  } catch (err) {
    next(err);
  }
});

router.get("/test-route", (_req, res) => {
  res.render("test", { title: "Test Route" });
});

module.exports = router;
