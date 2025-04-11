Here’s the **full `README.md`** for your GitHub repository, including instructions for PostgreSQL setup, Fastify setup, API documentation using Swagger, and more:

---

```markdown
# Fastify Backend with PostgreSQL and Swagger Docs

## Introduction

This project is a backend service built with Fastify and PostgreSQL. It provides an API for managing items, customers, sales, and products, along with monthly reports on customer sales. Swagger is used for API documentation, which is available at `/docs`.

## 🛠️ PostgreSQL Setup

### 1. Create the Database

First, you need to create a PostgreSQL database for your project.

Run the following command to create a database:

```bash
createdb -U postgres nachosales
```

Alternatively, you can use `psql` to create the database:

```sql
CREATE DATABASE nachosales;
```

### 2. Import the SQL Dump

If you are using the provided dump file (`codechallenge.sql`), run the following command to import the data:

```bash
psql -U postgres -d nachosales -f "path/to/codechallenge.sql"
```

Replace `"path/to/codechallenge.sql"` with the actual location of your SQL dump file.

### 3. Set Up Environment Variables

Create a `.env` file in the root directory of your project:

```bash
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/nachosales
PORT=3000
```

Make sure to replace `your_password` with your actual PostgreSQL password. Adjust the `DATABASE_URL` as needed (e.g., username, password, port).

## ⚙️ Environment Setup

### 1. Install Dependencies

Install the required dependencies using either **pnpm** or **npm**:

```bash
pnpm install  # or npm install
```

### 2. Start the Fastify Server

Run the server on port 3000:

```bash
pnpm dev  # or npm run dev
```

Your backend service should now be live at `http://localhost:3000`.

## 📡 Running Swagger Docs

Fastify comes with Swagger documentation for your API. Once the server is running, you can access the API docs by visiting:

```
http://localhost:3000/docs
```

Swagger UI will allow you to test the API endpoints and see their documentation.

## 📬 API Endpoints

Here is a list of available API endpoints for managing items, customers, sales, products, and reports:

### 📦 Items

- **GET** `/items` - Get all items
- **GET** `/items/:uuid` - Get an item by UUID
- **POST** `/item` - Add an item
- **PUT** `/items/:uuid` - Update an item
- **DELETE** `/items/:uuid` - Soft delete an item

### 👤 Customers

- **GET** `/customers` - Get all customers
- **GET** `/customers/:uuid` - Get a customer by UUID
- **POST** `/customer` - Add a new customer
- **PUT** `/customers/:uuid` - Update a customer by UUID
- **DELETE** `/customers/:uuid` - Soft delete a customer

### 🧾 Sales

- **GET** `/sales/all` - Get all sales
- **GET** `/sales/:uuid` - Get a sale by UUID
- **GET** `/sales/customer/:customer_uuid` - Get all sales by customer
- **POST** `/sale` - Add a new sale
- **PUT** `/sales/:uuid` - Update a sale
- **DELETE** `/sales/:uuid` - Soft delete a sale

### 🛍️ Products

- **GET** `/products` - Retrieve all products
- **GET** `/products/:uuid` - Retrieve a single product
- **POST** `/products` - Add a new product
- **PUT** `/products/:uuid` - Update a product
- **DELETE** `/products/:uuid` - Soft delete a product

### 📊 Reports

- **GET** `/reports/month/:year/:month` - Get customer sales summary by month

---

## 🤝 Contributing

Feel free to fork the repository, make improvements, and submit pull requests. If you find any bugs or have suggestions, feel free to open an issue.

---

## 🔒 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Happy coding! 🚀


---

### Key Highlights:

1. **PostgreSQL Setup**: Clear instructions on how to set up the database, import a dump, and configure environment variables.
2. **Fastify Setup**: Step-by-step guide on how to install dependencies, set up the project, and run the Fastify server.
3. **Swagger Docs**: Access the Swagger docs via `/docs` once the backend is running.
4. **API Endpoints**: Comprehensive list of available API endpoints for items, customers, sales, products, and reports.
5. **License and Contributing**: Standard sections for contributing and license information.

---

Let me know if you need further adjustments!
