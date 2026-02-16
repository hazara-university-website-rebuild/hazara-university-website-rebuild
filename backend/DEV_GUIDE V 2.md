## Hazara University Rebuild - Developer Guide
Welcome to the backend infrastructure for the Hazara University website. This project uses a high-performance, scalable stack designed for security and speed.

## System Overview
**Core Stack:** Node.js (Express 5.2) + MongoDB (Mongoose) + Redis.

**Architecture:** Service-Layer Pattern (Separation of Concerns) using ES Modules.

**Security:** Stateful Session Management via Redis + HttpOnly Cookie rotation.

## Getting Started
**Prerequisites**
**Node.js:** v22.x (LTS recommended).

**MongoDB:** v8.2 running locally or on Atlas.

**Redis:** v6.x or higher (Required for session management).

## Installation
**Clone the Repo:** git clone <repo-url>.

**Install Dependencies:** npm install.

**Environment Variables:** Create a .env file in the root directory (refer to .env.example).

**Start Redis Server:** Ensure redis-server is running.

**Run Development Server:** npm run dev.

📁 Directory Structure
We follow a modular, service-based architecture to keep code decoupled and maintainable:

Plaintext
backend/
├── config/             # Database and Redis connection setups
├── modules/            # Feature-based folders (Auth, News, etc.)
│   └── auth/           
│       ├── auth.controller.js  # Request/Response handling
│       ├── auth.service.js     # Pure Business Logic
│       ├── auth.routes.js      # Endpoint definitions
│       └── auth.validation.js  # Joi validation schemas
├── models/             # Mongoose schemas
├── middlewares/        # Security and validation guards
├── utils/              # Shared helper functions (tokens, cookies)
└── index.js            # Entry point of the application

## Security & Middleware
**1. Request Validation**
We use Joi for all input validation. Never trust raw user input.

Usage: All routes should use the validateBody(schema) middleware before hitting the controller.

**2. Authentication Flow**
We use a Stateful JWT system backed by Redis.

**Access Token:** 15m expiry (sent via HttpOnly Cookie).

**Refresh Token:** 7d expiry (stored in Redis and sent via HttpOnly Cookie).

**Global Logout:** Deletes the user's session key in Redis, instantly invalidating all devices.

## Development Standards
**Asynchronous Code:** Always use async/await with try/catch blocks for clean error handling.

**Commits:** Follow conventional commits (e.g., feat:, fix:, docs:).

**Environment:** Never hardcode secrets. Always use process.env.

## Testing with Postman
**Login:** Use POST /api/auth/login. This will set accessToken and refreshToken cookies.

**Protected Routes:** The browser/Postman will automatically send cookies. For manual testing, ensure "Include Cookies" is enabled.
