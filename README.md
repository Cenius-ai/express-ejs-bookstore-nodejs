# Express EJS Bookstore — production-ready Node.js book e-commerce storefront starter

**Express EJS Bookstore** gives you two paths: self-host the Apache-2.0-licensed Node.js source as your own e-commerce storefront, or [open it on cenius.ai](https://cenius.ai/marketplace/p/express-ejs-bookstore?ref=gh&utm_campaign=express-ejs-bookstore-nodejs), describe the changes you want, and receive a new Express EJS Bookstore build with full rebrand rights. A simple server-rendered bookstore built with Express, EJS templates, and SQLite. Everything ships in this repo — no paywall, no hidden features, no separate Express EJS Bookstore download.


[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE) ![Stack](https://img.shields.io/badge/Stack-Node.js-3b82f6) [![Built with cenius.ai](https://img.shields.io/badge/Built%20with-cenius.ai-8b5cf6)](https://cenius.ai)

[![Open in cenius.ai](https://img.shields.io/badge/▶%20Open%20%26%20edit%20in-cenius.ai-8b5cf6?style=for-the-badge)](https://cenius.ai/marketplace/p/express-ejs-bookstore?ref=gh&utm_campaign=express-ejs-bookstore-nodejs)

> **▶ [Open & edit in cenius.ai](https://cenius.ai/marketplace/p/express-ejs-bookstore?ref=gh&utm_campaign=express-ejs-bookstore-nodejs)** — one click to an editable workspace: describe changes in plain English, get an instant preview, one-click deploy and host. Modifications made on the platform come with full rebrand & relicense rights.

_Local clone? See [Quick start](#quick-start) below. cenius.ai is the zero-setup path._

## Demo

![Express EJS Bookstore demo — book e-commerce storefront built with Node.js](.github/media/hero.gif)

▶ **[Full demo walkthrough](https://cenius.ai/marketplace/p/express-ejs-bookstore?ref=gh&utm_campaign=express-ejs-bookstore-nodejs)** — watch it on the project page · [download MP4](.github/media/demo.mp4)

## Screenshots

<img src=".github/media/shot-1.png" width="32%" alt="Express EJS Bookstore e-commerce storefront screenshot 1"/> <img src=".github/media/shot-2.png" width="32%" alt="Express EJS Bookstore e-commerce storefront screenshot 2"/> <img src=".github/media/shot-3.png" width="32%" alt="Express EJS Bookstore e-commerce storefront screenshot 3"/>

## Features

- Book Catalog
- Book Detail
- Shopping Cart
- Admin Management

## Quick start

```bash
./install.sh   # installs dependencies + seeds demo data
```

See [`INSTALL.md`](INSTALL.md) for full setup and usage instructions.

## Usage guide

This document describes how to use the running **express-ejs-bookstore** application. All examples assume the server is running on `http://localhost:3000`; adjust the host and port as configured.

### Public Bookstore

#### Browse Catalog

Visit the home page to see all books:

```bash
curl http://localhost:3000/
```

#### View Book Details

Access a specific book by its ID:

```bash
curl http://localhost:3000/books/1
```

#### Shopping Cart

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

### Admin Area

All admin routes require authentication. First obtain a session cookie by logging in with the credentials set in your `.env` file.

#### Login

**View the login form:**

```bash
curl http://localhost:3000/admin/login
```

**Submit the login form** (replace `<username>` and `<password>` with your actual values):

```bash
curl -c cookies.txt -X POST -d "username=<username>&password=<password>" http://localhost:3000/admin/login
```

The session cookie is saved in `cookies.txt` and now used with the `-b` flag for subsequent requests.

#### Dashboard

View the list of all books (admin panel):

```bash
curl -b cookies.txt http://localhost:3000/admin
```

#### Add a New Book

**View the add‑book form:**

_Full guide: [`USAGE.md`](USAGE.md)_

## Architecture

Everything runs out of the box: a Node.js codebase (43 files). `install.sh` takes care of packages and initial data in a single pass; nothing else is required before launching. Top-level layout: `middleware/`, `models/`, `public/`, `routes/`, `views/`. Full setup details: [`INSTALL.md`](INSTALL.md).

## FAQ

### Can I deploy Express EJS Bookstore on my own infrastructure?

Pull the repo, run `./install.sh`, and you are up — the script installs packages and pre-seeds the database. [`INSTALL.md`](INSTALL.md) covers any platform-specific tweaks.

### How is Express EJS Bookstore built technically?

Node.js end-to-end. Every file you need to run the app is here in this repository — code, configuration, seed data. Highlights include book Catalog.

### Can I rebrand or white-label Express EJS Bookstore?

White-labeling is supported: fork the MIT-licensed source and rebrand it yourself, or use [cenius.ai](https://cenius.ai/marketplace/p/express-ejs-bookstore?ref=gh&utm_campaign=express-ejs-bookstore-nodejs) to make changes in a guided workspace — platform modifications come with full rebrand rights.

### Does the Express EJS Bookstore license allow commercial use?

It is. Apache-2.0 licensing means you can build a product on it, sell it, or use it inside a company with no fees. Details: [LICENSE](LICENSE).

### Can I change Express EJS Bookstore without writing code?

Open it on [cenius.ai](https://cenius.ai/marketplace/p/express-ejs-bookstore?ref=gh&utm_campaign=express-ejs-bookstore-nodejs) and describe the changes you want in plain English — the platform modifies the app and gives you a new, downloadable build.

## License & rebranding

Released under the [Apache License 2.0](LICENSE) (© 2026 Cenius AI) — free for personal and commercial use. The Cenius name/logo are trademarks (see NOTICE).

**Need a customized version?** [Remix this app on cenius.ai](https://cenius.ai/marketplace/p/express-ejs-bookstore?ref=gh&utm_campaign=express-ejs-bookstore-nodejs) — modifications made on the platform come with **full rebrand & relicense rights** over your derivative.

## Built with cenius.ai

This entire application — code, design, seeded demo data — was generated on **[cenius.ai](https://cenius.ai)** from a plain-English description.

- 🚀 [Build your own app on cenius.ai](https://cenius.ai)
- 🎛️ [Remix Express EJS Bookstore on the marketplace](https://cenius.ai/marketplace/p/express-ejs-bookstore?ref=gh&utm_campaign=express-ejs-bookstore-nodejs) — open it in a workspace, prompt for changes, and ship your own version.

More open-source apps: [the Cenius-ai catalog](https://github.com/Cenius-ai) · [showcase index](https://github.com/Cenius-ai/showcase)
