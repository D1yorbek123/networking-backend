# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All endpoints require JWT token in Authorization header (except /auth/register and /auth/login):

```
Authorization: Bearer <token>
```

## Response Format

All responses are JSON:

```json
{
  "message": "Success message",
  "data": { /* response data */ }
}
```

Errors:

```json
{
  "message": "Error description"
}
```

---

## Authentication Endpoints

### POST /auth/register

Register new user.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### POST /auth/login

Login user.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### GET /auth/verify

Verify JWT token.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": { /* user object */ }
}
```

---

## Customers Endpoints

### GET /customers

Get all customers. (Auth required)

**Response:**
```json
[
  {
    "_id": "customer-id",
    "name": "Fashion Retail Inc",
    "email": "contact@fashionretail.com",
    "phone": "+1234567890",
    "company": "Fashion Retail Inc",
    "industry": "Retail",
    "status": "active",
    "creditLimit": 10000,
    "totalSpent": 5000,
    "rating": 5
  }
]
```

### GET /customers/:id

Get customer by ID. (Auth required)

**Response:**
```json
{
  "_id": "customer-id",
  "name": "Fashion Retail Inc",
  /* ... full customer data ... */
}
```

### POST /customers

Create customer. (Admin only)

**Body:**
```json
{
  "name": "New Retail Store",
  "email": "new@retailstore.com",
  "phone": "+1234567891",
  "company": "Retail Store Inc",
  "industry": "Retail",
  "city": "New York",
  "country": "USA",
  "creditLimit": 15000
}
```

**Response:**
```json
{
  "_id": "new-customer-id",
  "name": "New Retail Store",
  /* ... customer data ... */
}
```

### PUT /customers/:id

Update customer. (Admin only)

**Body:** (any fields to update)
```json
{
  "status": "inactive",
  "creditLimit": 20000
}
```

**Response:** Updated customer object

### DELETE /customers/:id

Delete customer. (Admin only)

**Response:**
```json
{
  "message": "Customer deleted"
}
```

---

## Products Endpoints

### GET /products

Get all products. (Auth required)

### GET /products/:id

Get product by ID. (Auth required)

### POST /products

Create product. (Admin only)

**Body:**
```json
{
  "name": "Classic T-Shirt",
  "sku": "TSH-001",
  "category": "Shirts",
  "price": 29.99,
  "cost": 15.00,
  "quantity": 100,
  "reorderLevel": 20,
  "warehouse": "Main"
}
```

### PUT /products/:id

Update product. (Admin only)

### DELETE /products/:id

Delete product. (Admin only)

---

## Orders Endpoints

### GET /orders

Get all orders. (Auth required)

**Response:**
```json
[
  {
    "_id": "order-id",
    "orderNumber": "ORD-000001",
    "customer": { /* customer data */ },
    "items": [
      {
        "product": { /* product data */ },
        "quantity": 5,
        "price": 29.99
      }
    ],
    "totalAmount": 149.95,
    "status": "pending",
    "createdAt": "2024-06-04T10:00:00.000Z"
  }
]
```

### GET /orders/:id

Get order by ID. (Auth required)

### POST /orders

Create order. (Admin only)

**Body:**
```json
{
  "customer": "customer-id",
  "items": [
    {
      "product": "product-id",
      "quantity": 5,
      "price": 29.99
    }
  ],
  "totalAmount": 149.95,
  "shippingAddress": "123 Main St"
}
```

### PUT /orders/:id

Update order. (Admin only)

**Body:**
```json
{
  "status": "shipped"
}
```

### DELETE /orders/:id

Delete order. (Admin only)

---

## Deals Endpoints

### GET /deals

Get all deals. (Auth required)

**Response:**
```json
[
  {
    "_id": "deal-id",
    "name": "Fashion Hub Deal",
    "customer": { /* customer data */ },
    "value": 25000,
    "stage": "proposal",
    "probability": 75,
    "expectedCloseDate": "2024-07-04T00:00:00.000Z"
  }
]
```

### GET /deals/:id

Get deal by ID. (Auth required)

### POST /deals

Create deal. (Admin only)

**Body:**
```json
{
  "name": "Large Fashion Order",
  "customer": "customer-id",
  "value": 50000,
  "stage": "qualification",
  "probability": 50,
  "expectedCloseDate": "2024-07-04"
}
```

### PUT /deals/:id

Update deal. (Admin only)

**Body:**
```json
{
  "stage": "proposal",
  "probability": 75
}
```

### DELETE /deals/:id

Delete deal. (Admin only)

---

## Dashboard Endpoints

### GET /dashboard/admin

Get admin dashboard data. (Admin only)

**Response:**
```json
{
  "totalCustomers": 10,
  "activeCustomers": 8,
  "totalOrders": 12,
  "totalRevenue": 15000,
  "totalProducts": 15,
  "lowStockProducts": 3,
  "totalDeals": 8,
  "pendingDeals": 5,
  "recentOrders": [ /* array of orders */ ],
  "topCustomers": [ /* array of customers */ ]
}
```

### GET /dashboard/customer

Get customer dashboard data. (Auth required)

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request body |
| 401 | Unauthorized | Invalid or missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

---

## Rate Limiting

Currently no rate limiting. Implement in production.

---

## Examples

### Login and Get Customers

```bash
# 1. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# 2. Save token from response
TOKEN="<token-from-response>"

# 3. Get customers
curl -X GET http://localhost:5000/api/customers \
  -H "Authorization: Bearer $TOKEN"
```

### Create New Customer

```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name":"New Store",
    "email":"new@store.com",
    "company":"Store Inc",
    "creditLimit":10000
  }'
```

