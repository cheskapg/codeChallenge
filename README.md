# 🧾 NachoSales API (Fastify + PostgreSQL)

A lightweight backend built with **Fastify** and **PostgreSQL** to manage sales, customers, products, and reporting. This API supports common CRUD operations for a sales management system and is designed to work with a Next.js frontend (e.g. deployed on Vercel).

---

## 📚 Features

- 🔁 RESTful API with Fastify
- 🧠 PostgreSQL for structured data
- ♻️ Soft deletes for all entities
- 📆 Monthly sales report endpoint
- 🌐 Ready for frontend consumption (Next.js or any SPA)

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js (v18+)
- PostgreSQL
- `pnpm` or `npm` installed
- SQL dump file (`codechallenge.sql`)

---

## 🛠️ PostgreSQL Setup

### 1. Create the Database


createdb -U postgres nachosales
Or via psql:

sql
Copy
Edit
CREATE DATABASE nachosales;
2. Import the SQL Dump
If you're using the provided dump file:

bash
Copy
Edit
psql -U postgres -d nachosales -f "path/to/codechallenge.sql"
Replace the path with your actual .sql file location.

⚙️ Environment Setup
Create a .env file in the project root:

env
Copy
Edit
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/nachosales
PORT=3000
Adjust DATABASE_URL according to your local config (username, password, port, etc.)

📡 Running the Server
Install dependencies and run the Fastify server on port 3000:

bash
Copy
Edit
pnpm install   # or npm install
pnpm dev       # or npm run dev
Your backend should now be live at:

arduino
Copy
Edit
http://localhost:3000
📬 API Endpoints
📦 Items
GET /items — Get all items

GET /items/:uuid — Get item by UUID

POST /item — Add item

PUT /items/:uuid — Update item

DELETE /items/:uuid — Soft delete

👤 Customers
GET /customers

GET /customers/:uuid

POST /customer

PUT /customers/:uuid

DELETE /customers/:uuid

🧾 Sales
GET /sales/all

GET /sales/:uuid

GET /sales/customer/:customer_uuid

POST /sale

PUT /sales/:uuid

DELETE /sales/:uuid

🛍️ Products
GET /products

GET /products/:uuid

POST /products

PUT /products/:uuid

DELETE /products/:uuid

📊 Reports
GET /reports/month/:year/:month
Get customer sales summary by month
