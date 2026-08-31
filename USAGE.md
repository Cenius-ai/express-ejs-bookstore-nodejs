# Usage Guide

This document describes how to use the running **express-ejs-bookstore** application. All examples assume the server is running on `http://localhost:3000`; adjust the host and port as configured.

## Public Bookstore

### Browse Catalog

Visit the home page to see all books:

```bash
curl http://localhost:3000/
```

### View Book Details

Access a specific book by its ID:

```bash
curl http://localhost:3000/books/1
```

### Shopping Cart

The cart is session‑based – you must store and send cookies.

**Add a book to the cart:**

```bash
curl -c cookies.txt -X POST http://localhost:3000/cart/add/1
```

**View the cart:**

```bash
curl -b cookies.txt http://localhost:3000/cart
```

**Remove one copy (or all copies) from the cart:**

```bash
curl -b cookies.txt -X POST http://localhost:3000/cart/remove/1
```

## Admin Area

All admin routes require authentication. First obtain a session cookie by logging in with the credentials set in your `.env` file.

### Login

**View the login form:**

```bash
curl http://localhost:3000/admin/login
```

**Submit the login form** (replace `<username>` and `<password>` with your actual values):

```bash
curl -c cookies.txt -X POST -d "username=<username>&password=<password>" http://localhost:3000/admin/login
```

The session cookie is saved in `cookies.txt` and now used with the `-b` flag for subsequent requests.

### Dashboard

View the list of all books (admin panel):

```bash
curl -b cookies.txt http://localhost:3000/admin
```

### Add a New Book

**View the add‑book form:**

```bash
curl -b cookies.txt http://localhost:3000/admin/books/add
```

**Submit a new book** (form fields: `title`, `author`, `description`, `price`, `cover_url`, `stock`):

```bash
curl -b cookies.txt -X POST \
  -d "title=Example Book&author=Jane Doe&price=19.99&stock=5" \
  http://localhost:3000/admin/books
```

### Edit a Book

**View the edit form for a book:**

```bash
curl -b cookies.txt http://localhost:3000/admin/books/1/edit
```

**Submit changes** (same fields as creation):

```bash
curl -b cookies.txt -X POST \
  -d "title=Updated Title&price=24.99" \
  http://localhost:3000/admin/books/1
```

### Delete a Book

```bash
curl -b cookies.txt -X POST http://localhost:3000/admin/books/1/delete
```

### Logout

```bash
curl -b cookies.txt http://localhost:3000/admin/logout
```

After logout, the session is no longer valid.

## Other Routes

- **Test route** – renders a simple test page:

  ```bash
  curl http://localhost:3000/test-route
  ```

## Notes

- All forms are server‑rendered with EJS. The `curl` examples simulate form submissions for API‑like interaction.
- Cart and admin operations rely on session cookies; keep the cookies file when following flows.
- The admin credentials are defined in your `.env` file and seeded with `npm run seed`.