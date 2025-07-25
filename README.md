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

---

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

