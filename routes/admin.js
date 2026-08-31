const express = require("express");
const { getDb } = require("../db");
const { findByUsername, verifyPassword } = require("../models/admin");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// ── Login form ───────────────────────────────────────────────────
router.get("/login", (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.redirect("/admin");
  }
  const error = req.session.loginError;
  req.session.loginError = null;
  res.render("admin/login", { title: "Admin Login", error, layout: "admin/layout" });
});

// ── Login submit ─────────────────────────────────────────────────
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    req.session.loginError = "Username and password are required.";
    return res.redirect("/admin/login");
  }

  const admin = findByUsername(username);
  if (!admin || !verifyPassword(password, admin.password_hash)) {
    req.session.loginError = "Invalid username or password.";
    return res.redirect("/admin/login");
  }

  req.session.isAdmin = true;
  req.session.adminUsername = admin.username;
  const returnTo = req.session.returnTo || "/admin";
  delete req.session.returnTo;
  delete req.session.loginError;
  res.redirect(returnTo);
});

// ── Logout ───────────────────────────────────────────────────────
router.get("/logout", (req, res) => {
  req.session.isAdmin = false;
  req.session.adminUsername = null;
  res.redirect("/");
});

// ── Dashboard (book list) ────────────────────────────────────────
router.get("/", requireAdmin, (req, res, next) => {
  try {
    const db = getDb();
    const books = db.prepare("SELECT * FROM books ORDER BY id DESC").all();
    const message = req.session.adminMessage;
    req.session.adminMessage = null;
    res.render("admin/dashboard", { title: "Admin Dashboard", books, message, layout: "admin/layout" });
  } catch (err) {
    next(err);
  }
});

// ── Add book form ────────────────────────────────────────────────
router.get("/books/add", requireAdmin, (req, res) => {
  const error = req.session.adminError;
  const form = req.session.adminForm || {};
  req.session.adminError = null;
  req.session.adminForm = null;
  res.render("admin/add-book", { title: "Add Book", error, form, layout: "admin/layout" });
});

// ── Create book ──────────────────────────────────────────────────
router.post("/books", requireAdmin, (req, res, next) => {
  try {
    const { title, author, description, price, cover_url, stock } = req.body;

    // Server-side validation
    const errors = [];
    if (!title || title.trim().length === 0) errors.push("Title is required.");
    if (!author || author.trim().length === 0) errors.push("Author is required.");
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) errors.push("Price must be a non-negative number.");
    const stockNum = parseInt(stock, 10);
    if (isNaN(stockNum) || stockNum < 0) errors.push("Stock must be a non-negative integer.");

    if (errors.length > 0) {
      req.session.adminError = errors.join(" ");
      req.session.adminForm = { title, author, description, price, cover_url, stock };
      return res.redirect("/admin/books/add");
    }

    const db = getDb();
    db.prepare(`
      INSERT INTO books (title, author, description, price, cover_url, stock)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(title.trim(), author.trim(), description || null, priceNum, cover_url || null, stockNum);

    req.session.adminMessage = `"${title.trim()}" added successfully.`;
    res.redirect("/admin");
  } catch (err) {
    next(err);
  }
});

// ── Edit book form ───────────────────────────────────────────────
router.get("/books/:id/edit", requireAdmin, (req, res, next) => {
  try {
    const db = getDb();
    const book = db.prepare("SELECT * FROM books WHERE id = ?").get(req.params.id);
    if (!book) {
      return res.status(404).render("404", { title: "Not Found" });
    }
    const error = req.session.adminError;
    req.session.adminError = null;
    res.render("admin/edit-book", { title: "Edit Book", book, error, layout: "admin/layout" });
  } catch (err) {
    next(err);
  }
});

// ── Update book ──────────────────────────────────────────────────
router.post("/books/:id", requireAdmin, (req, res, next) => {
  try {
    const db = getDb();
    const existing = db.prepare("SELECT * FROM books WHERE id = ?").get(req.params.id);
    if (!existing) {
      return res.status(404).render("404", { title: "Not Found" });
    }

    const { title, author, description, price, cover_url, stock } = req.body;

    const errors = [];
    if (!title || title.trim().length === 0) errors.push("Title is required.");
    if (!author || author.trim().length === 0) errors.push("Author is required.");
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) errors.push("Price must be a non-negative number.");
    const stockNum = parseInt(stock, 10);
    if (isNaN(stockNum) || stockNum < 0) errors.push("Stock must be a non-negative integer.");

    if (errors.length > 0) {
      req.session.adminError = errors.join(" ");
      return res.redirect(`/admin/books/${req.params.id}/edit`);
    }

    db.prepare(`
      UPDATE books SET title = ?, author = ?, description = ?, price = ?, cover_url = ?, stock = ?
      WHERE id = ?
    `).run(title.trim(), author.trim(), description || null, priceNum, cover_url || null, stockNum, req.params.id);

    req.session.adminMessage = `"${title.trim()}" updated successfully.`;
    res.redirect("/admin");
  } catch (err) {
    next(err);
  }
});

// ── Delete book ──────────────────────────────────────────────────
router.post("/books/:id/delete", requireAdmin, (req, res, next) => {
  try {
    const db = getDb();
    const existing = db.prepare("SELECT title FROM books WHERE id = ?").get(req.params.id);
    if (!existing) {
      return res.status(404).render("404", { title: "Not Found" });
    }

    db.prepare("DELETE FROM books WHERE id = ?").run(req.params.id);
    req.session.adminMessage = `"${existing.title}" deleted.`;
    res.redirect("/admin");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
