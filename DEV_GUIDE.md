#  Developer Guide: Hazara University Rebuild

This guide is for **Mohammed Bilal** to integrate his modules with the core infrastructure built by **Muhammad Faheem**.

### Database Usage
The database connection is already configured in config/db.js.

Use Mongoose Models for your data (Degrees, Scholarships, etc.).
+1

Ensure all sensitive logic uses async/await for high performance.
+1

 Environment Variables (.env)
You will need a .env file in your local backend folder with these keys:

PORT=5000

MONGO_URI (Your local or Atlas string)

JWT_SECRET (Use the one provided in our chat)

---

##  Security & Authentication
I have implemented **JWT Authentication** and **Role-Based Access Control (RBAC)**.

### How to Protect Your Routes:
When you create routes for **Programs** or **Admissions**, use the `protect` middleware to ensure only authorized staff can access them.

```javascript
const { protect } = require('../middleware/authMiddleware');

// Example: Only logged-in users can add a program
router.post('/add-program', protect, addProgram);

---
