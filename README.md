# Product API - Express.js RESTful Server

## Project Overview

This project is a RESTful API built with Express.js that manages a product catalog.  
It includes basic CRUD operations and advanced features like filtering, pagination, searching, and statistics.  
It also implements middleware for logging, authentication, validation, and error handling.

## Setup & Running the Server

### Prerequisites
- Node.js v18 or higher recommended
- npm (comes with Node.js)

### Installation

1. Clone the repository or download project files.
2. Navigate to the project directory in your terminal.
3. Install dependencies:
   ```bash
   npm install

# Create a .env file based on .env.example and add your API key

API_KEY=mysecretapikey

Run the server:
node server.js

Server will start on port 3000 by default:
Server is running on http://localhost:3000

# 🛠 Environment Variables
Variable	Description	Example
API_KEY	API key for requests	mysecretapikey

# 🔑 Authentication
All API requests require the following header with your API key:
x-api-key: your_api_key_here

# 📦 API Endpoints
1. Get all products (with optional filtering and pagination)
GET /api/products

# Query Parameters
Parameter	Description	Example
category	Filter by product category	electronics
page	Page number for pagination	1 (default)
limit	Items per page	10 (default)
curl -H "x-api-key: mysecretapikey" "http://localhost:3000/api/products?category=electronics&page

# Get a product by ID
GET /api/products/:id

Example Request:
curl -H "x-api-key: mysecretapikey" http://localhost:3000/api/products/1

# Create a new product
POST /api/products

Body (JSON):
{
  "name": "New Product",
  "description": "Product description",
  "price": 100,
  "category": "category_name",
  "inStock": true
}

# Example Request:
curl -X POST -H "Content-Type: application/json" -H "x-api-key: mysecretapikey" -d '{"name":"New}

# Update a product
PUT /api/products/:id

Body (JSON): same structure as POST

# Delete a product
DELETE /api/products/:id

# Search products by name
GET /api/products/search?name=keyword

# Get product statistics (count by category)
GET /api/products/stats

# ⚠️ Error Handling
The API returns JSON errors with appropriate HTTP status codes:
Status Code	Description
400	Bad Request (validation errors)
401	Unauthorized (missing or invalid API key)
404	Not Found (product not found)
500	Internal Server Error (unexpected errors)

# 📝 Notes
API key is required for all requests.

Data is stored in-memory — all changes reset when the server restarts.

Feel free to extend or connect this API to a database for persistence.

# 📂 .env.example
Rename this file to .env and fill in your API key:
PI_KEY=mysecretapikey

# 📬 Contact
If you have any questions or feedback, feel free to reach out!
Email me: derrickswaka910@gmail.com