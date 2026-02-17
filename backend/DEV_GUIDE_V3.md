# 📚 Backend Developer Guide

## Overview

This backend is built with **Node.js**, **Express**, **MongoDB**, and **Redis**, emphasizing **clean architecture**, **centralized error handling**, and **easy module development**.

The goal is to allow developers to **add new modules, services, and controllers** without worrying about scattered imports or inconsistent error handling.

---

## Folder Structure

```
backend/
 ├─ modules/          # Feature-specific modules (controllers, services, etc.)
 ├─ models/           # Mongoose models
 ├─ utils/            # Utility functions (single folder, centralized)
 ├─ errors/           # Custom error classes
 ├─ config/           # DB & Redis setup
 ├─ middleware/       # Auth, error handling, etc.
 └─ index.js           # Entry point
```

---

## 1️⃣ Error Handling

**Philosophy:**

* Centralized custom errors in `errors/` exported via `errors/index.js`.
* Always throw **custom errors**, never raw system errors.
* Controllers/services errors propagate to a **global error middleware**.

**Guidelines:**

* **Services:** throw errors (`NotFoundError`, `ConflictError`, etc.).
* **Controllers:** wrap async functions in `asyncHandler`; avoid try-catch unless transforming errors.
* **Startup scripts (DB/Redis):** throw `DatabaseError` on critical failures.

**Example — Service:**

```js
import { NotFoundError } from "../errors/index.js";

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new NotFoundError("User not found");
  return user;
};
```

**Example — Controller:**

```js
import { asyncHandler } from "../utils/index.js";
import { loginService } from "../modules/auth/auth.service.js";

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginService(email, password);
  res.json(result);
});
```

---

## 2️⃣ Utilities

All utility functions are centralized in the **single `utils` folder**, exported via `utils/index.js`.

**Includes:**

* JWT token generation & verification
* Session management (Redis)
* Cookie handling
* `asyncHandler`
* Helper functions like TTL parsers

**Guidelines:**

* Always import from `utils/index.js`.
* Add new utilities to `index.js` for centralized access.

---

## 3️⃣ Database & Redis Setup

* **MongoDB:** `config/db.js` — throws `DatabaseError` if connection fails.
* **Redis:** `config/redis.js` — throws `DatabaseError` on critical startup failures.
* Runtime errors are logged by event listeners (`on("error")`).

---

## 4️⃣ Writing New Modules

1. Create **service** in `modules/<module>/<module>.service.js`.
2. Create **controller** in `modules/<module>/<module>.controller.js`.
3. Add **routes** in `routes/` pointing to controllers.
4. Throw **custom errors** in services.
5. Wrap controller functions with `asyncHandler`.
6. Add new utilities to `utils` and export via `utils/index.js`.
7. Import everything via centralized exports (`utils/index.js`, `errors/index.js`).

---

## 5️⃣ Error Flow

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

## 6️⃣ Example Imports

```js
// Errors
import { NotFoundError, ConflictError } from "../errors/index.js";

// Utilities
import { asyncHandler, generateAccessToken, saveSession } from "../utils/index.js";
```

✅ Consistent imports and predictable error handling.

---

## 7️⃣ Best Practices

* Always **throw errors** in services.
* **Do not catch errors in controllers**; wrap with `asyncHandler`.
* Use **centralized exports** for utilities and errors.
* Include `.js` extensions in ES module imports.
* Follow the folder + index pattern for new modules.