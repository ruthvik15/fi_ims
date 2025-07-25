# 📦 Inventory Management System API

This repository contains the **backend source code** for a feature-rich **Inventory Management System**, developed using **Node.js**, **Express**, and **PostgreSQL**.

The API supports secure user authentication, role-based access control, full CRUD operations for products, and advanced analytics endpoints. It is fully **Dockerized** for easy setup and includes **Swagger documentation** for developers.

---

## ⭐ Features

### 🔐 Secure Authentication
- JWT-based auth with **httpOnly cookies**
- Login, Register, Logout, and Session Verification (`/me`)
- Cookie-based for frontend clients and **Bearer token** support for testing tools

### 👥 Role-Based Access Control (RBAC)
- `admin`: Can access all endpoints including analytics and all product updates
- `user`: Can only manage their own products
## 🧩 Database Schema

This project uses **PostgreSQL** as the database with two main tables: `users` and `products`. Triggers are used to automatically update `updated_at` timestamps on every row update.

### 📦 Product Management
- Add, edit, and fetch product details
- Update product quantity (with permission checks)
- Fetch user-owned products (`/products/mine`)
- Get single product details (`/products/:id`)

### 📊 Analytics (Admin Only)
- Recent Products (`/products/recent`)
- Valuable Products (`/products/valuable`)
- Category Breakdown (`/products/category-breakdown`)
- Summary Metrics (`/products/analytics`)

### 📃 Pagination Support
- All list endpoints (`/products`, `/users`) are **paginated**
- Supports `?page=<number>&limit=<number>`

### ✅ Validation & Error Handling
- Validates all fields (e.g., username length, password strength, non-negative quantity)
- Descriptive error messages with proper HTTP status codes (400, 401, 403, 409)

### 📚 API Documentation
- Swagger UI available at `/docs`
- Describes request/response formats and auth requirements

 ## 🧭 API Routes


  <summary><strong>🔐 Auth Routes</strong></summary>

| Method | Endpoint     | Description                      | Auth Required |
|--------|--------------|----------------------------------|----------------|
| POST   | `/register`  | Register a new user              | ❌             |
| POST   | `/login`     | Log in a user                    | ❌             |
| GET    | `/me`        | Get current logged-in user       | ✅             |
| POST   | `/logout`    | Log out the current user         | ✅             |


<br />


  <summary><strong>📦 Product Routes</strong></summary>

| Method | Endpoint                     | Description                                   | Auth Required |
|--------|------------------------------|-----------------------------------------------|----------------|
| POST   | `/products`                  | Add a new product                             | ✅             |
| GET    | `/products`                  | Get paginated list of all products            | ✅             |
| GET    | `/products/mine`             | Get products created by the current user      | ✅             |
| GET    | `/products/{id}`             | Get details of a specific product by ID       | ✅             |
| PUT    | `/products/{id}/quantity`    | Update quantity of a specific product         | ✅ (Creator or Admin) |


<br />


  <summary><strong>📊 Analytics Routes (Admin Only)</strong></summary>

| Method | Endpoint                            | Description                                | Admin Only |
|--------|-------------------------------------|--------------------------------------------|------------|
| GET    | `/products/analytics`               | Get overall product statistics              | ✅         |
| GET    | `/products/recent`                  | Get recently added products                 | ✅         |
| GET    | `/products/valuable`                | Get most valuable products (price × qty)    | ✅         |
| GET    | `/products/category-breakdown`      | Get count/quantity grouped by category      | ✅         |


<br />


  <summary><strong>👤 User Management (Admin Only)</strong></summary>

| Method | Endpoint     | Description                     | Admin Only |
|--------|--------------|----------------------------------|------------|
| GET    | `/users`     | Get paginated list of all users | ✅         |



---

### I used AI for :
-Drafting the initial README structure.

-For well structured Swagger docs 

-Reviewed potential edge cases in user registration, pagination, and token expiration logic .

-For the catch blocks(http response codes)

-Writing and optimizing PostgreSQL schema and Queries , including triggers for updated_at.

-for best and secure Practices and Code Review

-Assisting with frontend CSS styling suggestions to improve layout.


```bash
git clone "https://github.com/ruthvik15/fi_ims"
cd  fi_ims
```
## 🚀 Getting Started
```
# Start Frontend
cd frontend
npm install
npm run dev

# In a new terminal, start Backend
cd backend
npm install
npm start
```




.env 
```
# .env
PORT=8080

# PostgreSQL

PORT=8080

DB_HOST=localhost
DB_PORT=5432
DB_NAME=fi_money
DB_USER=postgres
DB_PASSWORD=password_here

# JWT
JWT_SECRET=this_is_a_very_secure_secret_key
JWT_EXPIRES_IN=1d
```

DOCKER SETUP
```
cd backend
docker compose up --build
```

<img width="1642" height="850" alt="image" src="https://github.com/user-attachments/assets/7ba48c1f-650f-48b6-a723-9c579a37ea29" />
<img width="1865" height="908" alt="image" src="https://github.com/user-attachments/assets/d53ee07d-3e38-4d9f-84ab-efc619e7cca2" />
<img width="1863" height="789" alt="image" src="https://github.com/user-attachments/assets/197b91ab-555d-4fa1-8ba0-7bed3aba2f06" />
<img width="1652" height="836" alt="image" src="https://github.com/user-attachments/assets/ec8d1424-1bd0-4c1d-84ab-4d3915dd70e4" />


