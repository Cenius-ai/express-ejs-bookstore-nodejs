# Installation Guide

Follow these steps to set up and run the **express-ejs-bookstore** application locally.

## 1. Prerequisites

- **Node.js 20 or later** (includes npm)
  - Verify with: `node -v`
  - Download from [nodejs.org](https://nodejs.org/) if needed.

## 2. Get the Code

Clone the repository or download the source code.

## 3. Install Dependencies

Run the following command in the project root:

```bash
npm install
```

This installs all packages listed in `package.json`.

## 4. Set Up Environment Variables

Copy the environment template and edit it:

```bash
cp .env.example .env
```

Open `.env` and set all required variables:

- `ADMIN_USERNAME` – username for the admin account
- `ADMIN_PASSWORD` – password for the admin account
- `SECRET` – secret used to hash the admin password during seeding
- `SESSION_SECRET` – secret used to sign the session ID cookie
- `PORT` (optional) – server port (defaults to 3000)
- `ROOT` (optional) – base path if served behind a proxy

## 5. Initialize & Seed the Database

The SQLite database file (`bookstore.db`) is created automatically when the server first runs. To populate it with demo books and the admin user, run:

```bash
npm run seed
```

This script uses the `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `SECRET` values from your `.env`.

## 6. Start the Application

Run the development server:

```bash
npm run dev
```

Or equivalently:

```bash
npm start
```

The application will be available at `http://localhost:<PORT>` (default `http://localhost:3000`).

## 7. Testing

No test script is currently configured.

## 8. Production Build

No production build step is required; the server runs the same in development and production.

## Troubleshooting

- **Node.js version**: Ensure you are using Node.js 20 or later (`node -v`).
- **Missing .env**: If the server fails to start with configuration errors, verify that `.env` exists in the project root and contains all required variables.
- **Port conflict**: If port 3000 is in use, change the `PORT` value in `.env` to an available port.
- **Database issues**: If the seed script or queries fail, delete `bookstore.db` (and any `-shm`/`-wal` files) and re-run `npm run seed`.