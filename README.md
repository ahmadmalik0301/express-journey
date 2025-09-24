# 🚀 Express Progression Projects

This repository contains 5 step-by-step projects built with **Express.js**, showing how to move from a simple API to a secure product management system with authentication and roles.

---

---

## 📘 Projects Overview

### 1. Simple API

- A minimal Express server
- Basic routes (`GET`, `POST`)
- Middleware usage

---

### 2. JWT Auth

- Implements authentication with **JSON Web Tokens (JWT)**
- Login & register endpoints
- Protected routes using token verification

---

### 3. DB Auth

- Stores users in a real database (e.g., **MongoDB** or **Postgres**)
- Password hashing with **bcrypt**
- Login, register, and authenticated routes

---

### 4. Role-Based Auth

- Adds **roles** (e.g., `user`, `admin`)
- Middleware to check role permissions
- Restricts access based on role

---

### 5. Product Management

- Full **CRUD API** for products
- Authentication + role-based authorization
- Private routes only accessible to authenticated users
- Example: only admins can delete products

---

## 🛠️ Setup & Run

Each project has its own `package.json`.  
Navigate into the project folder and install dependencies:

```bash
cd 02-jwt-auth
npm install
npm start
```
