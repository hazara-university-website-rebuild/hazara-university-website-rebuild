# Hazara University Backend Developer Guide

*Author: Jibran Shah*

Welcome to the backend infrastructure for the Hazara University website. This guide provides a complete overview for developers to understand, integrate, and extend the backend modules efficiently.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Folder Structure](#folder-structure)
5. [Environment Variables](#environment-variables)
6. [Security & Authentication](#security--authentication)
7. [Error Handling](#error-handling)
8. [Writing New Modules](#writing-new-modules)
9. [Utilities](#utilities)
10. [Testing](#testing)
11. [Best Practices](#best-practices)

---

## System Overview

**Core Stack:**

* Node.js (Express 5.2)
* MongoDB (Mongoose)
* Redis (session management)

**Architecture:** Service-Layer Pattern (Separation of Concerns) using ES Modules.

**Security:** Stateful JWT + Redis session management + HttpOnly cookie rotation.

---

## Prerequisites

* **Node.js:** v22.x (LTS recommended)
* **MongoDB:** v8.2 (local or Atlas)
* **Redis:** v6.x or higher (Required for session management)

---

## Installation

```bash
# Clone the repository
git clone <repo-url>

# Install dependencies
npm install

# Create .env file based on .env.example

# Start Redis server
redis-server

# Run development server
npm run dev
```

---

## Folder Structure

```
backend/
 ├─ config/             # Database & Redis setup
 ├─ modules/            # Feature-specific modules
 │    └─ <module>/      
 │        ├─ <module>.controller.js
 │        ├─ <module>.service.js
 │        ├─ <module>.routes.js
 │        └─ <module>.validation.js
 ├─ models/             # Mongoose models
 ├─ utils/              # Centralized utilities
 ├─ errors/             # Custom errors
 ├─ middleware/         # Auth, validation, error handling
 └─ index.js            # Entry point
```

**Notes:**

* Each module has **its own routes, controller, service, and validation** inside `modules/<module>`.
* Use **centralized exports** in `utils/index.js` and `errors/index.js` for imports.

---

## Environment Variables

The `.env` file should include:

```env
PORT=5000
MONGO_URI=<your-mongo-uri>
REDIS_URI=<your-redis-uri>
JWT_SECRET=<your-jwt-secret>
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d
```

---

## Security & Authentication

* **JWT Authentication:** Access tokens (15m) & Refresh tokens (7d) via HttpOnly cookies.
* **Role-Based Access Control (RBAC):** Use `protect` middleware to secure routes.

Example:

```javascript
import { protect } from '../middleware/authMiddleware.js';
router.post('/add-program', protect, addProgramController);
```

* **Global Logout:** Deletes the user's session in Redis, invalidating all devices instantly.

---

## Error Handling

* All errors are **custom errors** stored in `errors/` and propagated via **asyncHandler**.
* **Services** throw errors like `NotFoundError` or `ConflictError`.
* **Controllers** wrap async functions with `asyncHandler`.

Example — Service:

```javascript
import { NotFoundError } from "../errors/index.js";

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new NotFoundError("User not found");
  return user;
};
```

Example — Controller:

```javascript
import { asyncHandler } from "../utils/index.js";
import { loginService } from "../modules/auth/auth.service.js";

export const loginController = asychHandler( async (req, res) => {
  const { email, password } = req.body;
  const result = await loginService(email, password);
  res.json(result);
});
```

OR even better

when registerring a controller use it there

```javascript
router.get("/",asyncHandler(controller))
```

**Error Flow:**

```
Client → Route → Controller (asyncHandler)
           ↓
         Service
           ↓ throws custom error
       asyncHandler catches
           ↓
     Global Error Middleware
           ↓
   HTTP Response sent to Client
```

---

## Writing New Modules

1. Create `modules/<module>/<module>.service.js` (business logic).
2. Create `modules/<module>/<module>.controller.js` (request/response handling).
3. Create `modules/<module>/<module>.routes.js` (endpoints).
4. Create `modules/<module>/<module>.validation.js` (Joi validation schemas).
5. Use **async/await** in services for performance.
6. Throw **custom errors** in services.
7. Wrap controllers with `asyncHandler`.
8. Add any new helper functions to `utils/` and export via `utils/index.js`.

---

## Utilities

* JWT token generation & verification
* Redis session management
* Cookie helpers
* `asyncHandler` for controllers
* TTL parsers and other helpers

**Guideline:** Always import from `utils/index.js` for consistency.

---

## Testing

* **Login:** POST `/api/auth/login` → sets accessToken and refreshToken cookies.
* **Protected Routes:** Cookies are sent automatically. For Postman, enable **“Include Cookies”**.
* **Example:** Add a program, check admissions routes, etc.

---

## Best Practices

* Always **throw errors in services**, don’t catch them in controllers.
* Use **centralized imports** from `utils/index.js` and `errors/index.js`.
* Follow **folder + index pattern** for new modules.
* Include `.js` in ES module imports.
* Follow **async/await** + try/catch philosophy for error handling.
* Commit using **conventional commits** (`feat:`, `fix:`, `docs:`).
