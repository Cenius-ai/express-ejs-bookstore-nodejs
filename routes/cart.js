const express = require("express");
const { getDb } = require("../db");

const router = express.Router();

/**
 * Ensure req.session.cart is an object.
 */
function ensureCart(req) {
  if (!req.session.cart) {
    req.session.cart = {};
  }
}

/**
 * GET /cart — view the shopping cart with book details and totals.
 */
router.get("/", (req, res, next) => {
  try {
    ensureCart(req);
    const cart = req.session.cart;
    const db = getDb();

    // Load book details for each cart entry
    const items = [];
    let total = 0;

    for (const [bookIdStr, qty] of Object.entries(cart)) {
      const bookId = Number(bookIdStr);
      const book = db.prepare("SELECT id, title, author, price, cover_url FROM books WHERE id = ?").get(bookId);
      if (book) {
        const lineTotal = book.price * qty;
        items.push({ ...book, qty, lineTotal });
        total += lineTotal;
      }
    }

    res.render("cart", { title: "Your Cart", items, total });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /cart/add/:bookId — add one copy of a book to the cart.
 */
router.post("/add/:bookId", (req, res, next) => {
  try {
    ensureCart(req);
    const bookId = Number(req.params.bookId);
    const db = getDb();

    const book = db.prepare("SELECT id, stock FROM books WHERE id = ?").get(bookId);
    if (!book) {
      return res.status(404).render("404", { title: "Not Found" });
    }

    const current = req.session.cart[bookId] || 0;
    if (current + 1 > book.stock) {
      // Flash message: not enough stock — we'll store in session for simplicity
      req.session.cartMessage = `Only ${book.stock} copies of this title are available.`;
      return res.redirect("/cart");
    }

    req.session.cart[bookId] = current + 1;
    req.session.cartMessage = "Book added to your cart.";
    res.redirect("/cart");
  } catch (err) {
    next(err);
  }
});

/**
 * POST /cart/remove/:bookId — remove one copy (or all copies) from the cart.
 */
router.post("/remove/:bookId", (req, res, next) => {
  try {
    ensureCart(req);
    const bookId = Number(req.params.bookId);
    const current = req.session.cart[bookId] || 0;

    if (current <= 1) {
      delete req.session.cart[bookId];
    } else {
      req.session.cart[bookId] = current - 1;
    }

    req.session.cartMessage = "Cart updated.";
    res.redirect("/cart");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
