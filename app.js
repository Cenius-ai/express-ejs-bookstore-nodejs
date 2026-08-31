require("dotenv").config();

const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const path = require("path");

const indexRoutes = require("./routes/index");
const bookRoutes = require("./routes/books");
const cartRoutes = require("./routes/cart");
const adminRoutes = require("./routes/admin");

const app = express();

// ── Security: fail fast on missing/invalid session secret ────────
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET || SESSION_SECRET === "changeme" || SESSION_SECRET.length < 16) {
  console.error(
    "FATAL: SESSION_SECRET is missing, too short, or still set to a placeholder.\n" +
    "Run install.sh to generate one, or set a strong random value in your .env file."
  );
  process.exit(1);
}

const PORT = parseInt(process.env.PORT, 10) || 3000;

// ── Security headers ──────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "https://images.unsplash.com", "data:"],
      connectSrc: ["'self'"],
    },
  },
}));

// ── Body parsing ──────────────────────────────────────────────────
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));

// ── Static files ──────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "public")));

// ── Session ───────────────────────────────────────────────────────
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,       // set true behind a reverse proxy with TLS
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// ── Cart count for layout ─────────────────────────────────────────
app.use((req, res, next) => {
  const cart = req.session.cart || {};
  let cartCount = 0;
  for (const qty of Object.values(cart)) {
    cartCount += qty;
  }
  res.locals.cartCount = cartCount;

  // Pass cart message (cleared after render)
  const msg = req.session.cartMessage;
  res.locals.message = msg;
  if (msg) {
    req.session.cartMessage = null;
  }

  next();
});

// ── Set view engine ───────────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ── Routes ────────────────────────────────────────────────────────
app.use("/", indexRoutes);
app.use("/books", bookRoutes);
app.use("/cart", cartRoutes);
app.use("/admin", adminRoutes);

// ── Catch-all 404 ─────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).render("404", { title: "Not Found" });
});

// ── Central error handler ─────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);

  const status = err.status || 500;
  const message = status === 500
    ? "Something went wrong. Please try again later."
    : err.message;

  res.status(status).render("error", {
    title: "Error",
    status,
    message,
    layout: undefined,
  });
});

// ── Start server ──────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bookstore running at http://localhost:${PORT}`);
  });
}

module.exports = app;
