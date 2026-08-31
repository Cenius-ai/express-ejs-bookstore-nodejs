/**
 * Middleware: require an authenticated admin session.
 * Redirects to /admin/login if not logged in.
 */
function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  return res.redirect("/admin/login");
}

module.exports = { requireAdmin };
