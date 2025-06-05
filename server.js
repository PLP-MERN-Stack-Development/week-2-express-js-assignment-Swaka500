// server.js - Completed assignment Express server for Tasks 1-5

const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = 'mysecretapikey'; // Your API key for auth

// --- Custom Error Classes ---
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

// --- Async handler wrapper to catch async errors ---
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// --- Logger Middleware ---

// Logger middleware: logs method, url, timestamp
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// JSON parser middleware
app.use(bodyParser.json());

// Authentication middleware 
app.use((req, res, next) => {
  const apiKey = req.header('x-api-key');
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }
  next();
});

// --- In-memory products data ---
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 11200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 256GB storage',
    price: 1800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 100,
    category: 'kitchen',
    inStock: false
  }
];

// --- Validation middleware for POST & PUT prduct ---
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  if (
    typeof name !== 'string' ||
    typeof description !== 'string' ||
    typeof price !== 'number' ||
    typeof category !== 'string' ||
    typeof inStock !== 'boolean'
  ) {
    return next(new ValidationError('Invalid product data'));
  }
  next();
};

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// GET /api/products - with filtering by category and pagination
app.get('/api/products', asyncHandler(async (req, res) => {
  let filteredProducts = [...products];

  // Filter by category if provided
  if (req.query.category) {
    filteredProducts = filteredProducts.filter(
      p => p.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }

  // Pagination logic
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  res.json({
    page,
    limit,
    totalItems: filteredProducts.length,
    totalPages: Math.ceil(filteredProducts.length / limit),
    products: paginatedProducts
  });
}));

// GET /api/products/:id - get product by id
app.get('/api/products/:id', asyncHandler(async (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  res.json(product);
}));

// POST /api/products - create new product
app.post('/api/products', validateProduct, asyncHandler(async (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
}));

// PUT /api/products/:id - update product
app.put('/api/products/:id', validateProduct, asyncHandler(async (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    throw new NotFoundError('Product not found');
  }

  const { name, description, price, category, inStock } = req.body;
  products[index] = { ...products[index], name, description, price, category, inStock };
  res.json(products[index]);
}));

// DELETE /api/products/:id - delete product
app.delete('/api/products/:id', asyncHandler(async (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    throw new NotFoundError('Product not found');
  }
  const deletedProduct = products.splice(index, 1);
  res.json(deletedProduct[0]);
}));

// GET /api/products/search?name=keyword - search by product name
app.get('/api/products/search', asyncHandler(async (req, res, next) => {
  const { name } = req.query;
  if (!name) {
    throw new ValidationError('Missing "name" query parameter');
  }
  const results = products.filter(p =>
    p.name.toLowerCase().includes(name.toLowerCase())
  );
  res.json(results);
}));

// GET /api/products/stats - product count by category
app.get('/api/products/stats', asyncHandler(async (req, res) => {
  const stats = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});
  res.json(stats);
}));

// --- Global error handling middleware ---
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export app for testing
module.exports = app;
 // --- End of server.js ---
// This code implements a complete Express server for managing products with various features like filtering, pagination, searching, and error handling.