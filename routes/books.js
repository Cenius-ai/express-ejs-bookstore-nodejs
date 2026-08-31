const express = require("express");
const { getDb } = require("../db");

const router = express.Router();

router.get("/:id", (req, res, next) => {
  try {
    const db = getDb();
    const book = db.prepare("SELECT * FROM books WHERE id = ?").get(req.params.id);

    if (!book) {
      return res.status(404).render("404", { title: "Not Found" });
    }

    const cart = req.session.cart || {};
    const inCart = cart[book.id] || 0;

    res.render("book-detail", { title: book.title, book, inCart });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
