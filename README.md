# Fashion Hub CRM - Full-Stack Application

A complete Enterprise CRM System built with **Next.js 16**, **Node.js/Express**, **MongoDB**, and **Docker**.

## Project Structure

```
crm-system/
├── frontend/                 # Next.js 16 Application
│   ├── app/                 # Pages and layouts
│   ├── components/          # React components
│   ├── lib/                 # Utilities (API, auth)
│   ├── public/              # Static files
│   ├── Dockerfile
│   └── package.json
├── backend/                  # Node.js/Express API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/      # Business logic
│   │   ├── models/          # MongoDB schemas
│   │   ├── middleware/      # Auth, validation
│   │   ├── config/          # Database config
│   │   └── server.js        # Main server file
│   ├── data/
│   │   └── seeders.js       # Fake data generator
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml        # Docker orchestration
└── README.md
```

## Features

### Authentication & Authorization
- JWT-based authentication
- Two roles: Admin and Customer
- Secure password hashing with bcryptjs
- Protected routes with role-based access

### Admin Features
- Dashboard with KPIs and analytics
- Customer management (CRUD)
- Product inventory management
- Order tracking and management
- Sales pipeline (Deals)
- Activity logging
- Real-time data from MongoDB

### Customer Features
- Personal dashboard
- View order history
- Order status tracking
- Account profile management
- Real-time data sync

### Data Management
- 6 MongoDB models (User, Customer, Product, Order, Deal, ActivityLog)
- Comprehensive seed data (10+ records per collection)
- Real API integration (no demo data)
- Full CRUD operations

## Technology Stack

### Frontend
- Next.js 16 with React 19
- Tailwind CSS 4
- Recharts for data visualization
- Lucide React icons
- Axios for API calls
- localStorage for JWT tokens

### Backend
- Node.js 18
- Express.js 4
- MongoDB with Mongoose ORM
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

### Database
- MongoDB (Atlas or local)
- Mongoose ODM
- 6 collections with proper relationships
- Indexes for performance

### Deployment
- Docker containers for all services
- Docker Compose for orchestration
- Scalable architecture

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (for containerized setup)
- MongoDB (local or Atlas)

### Installation

#### Option 1: Using Docker Compose (Recommended)

```bash
cd crm-system

# Start all services
docker-compose up -d

# Seed data (after backend is ready)
docker exec crm-backend npm run seed

# Access:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

#### Option 2: Local Development

**Backend Setup:**
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with local MongoDB connection

# Start server
npm run dev

# In another terminal, seed data
npm run seed
```

**Frontend Setup:**
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Access: http://localhost:3000
```

## Demo Credentials

### Admin Account
- **Email:** admin@example.com
- **Password:** admin123
- **Access:** All admin features

### Customer Account
- **Email:** john@company1.com
- **Password:** password123
- **Access:** Customer dashboard

## Seed Data

The application includes comprehensive fake data:
- **2** Admin users
- **8** Customer users
- **10** Customer records
- **15** Products
- **12** Orders
- **8** Sales deals
- **20+** Activity logs

To seed data:
```bash
# Local
cd backend && npm run seed

# Docker
docker exec crm-backend npm run seed
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify token

### Customers (Admin only)
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Products (Admin only)
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders (Admin only)
- `GET /api/orders` - List all orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Deals (Admin only)
- `GET /api/deals` - List all deals
- `GET /api/deals/:id` - Get deal details
- `POST /api/deals` - Create deal
- `PUT /api/deals/:id` - Update deal
- `DELETE /api/deals/:id` - Delete deal

### Dashboard
- `GET /api/dashboard/admin` - Admin dashboard data (Admin only)
- `GET /api/dashboard/customer` - Customer dashboard data

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://mongo:27017/crm-system
MONGODB_LOCAL=mongodb://localhost:27017/crm-system
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Database Schema

### User
- id, name, email, password (hashed), role, department, phone, address, city, country, avatar, isActive, timestamps

### Customer
- id, name, email, phone, company, industry, address, city, country, status, creditLimit, totalSpent, rating, notes, createdBy, timestamps

### Product
- id, name, sku, category, description, price, cost, quantity, reorderLevel, warehouse, image, status, timestamps

### Order
- id, orderNumber, customer, items (product, quantity, price), totalAmount, status, shippingAddress, notes, createdBy, timestamps

### Deal
- id, name, customer, value, stage (prospect/qualification/proposal/negotiation/closed), probability, expectedCloseDate, assignedTo, description, timestamps

### ActivityLog
- id, user, action (CREATE/UPDATE/DELETE), resourceType, resourceId, details, ipAddress, timestamps

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based access control (RBAC)
- Environment variables for secrets
- CORS configuration
- Input validation
- Activity logging for audit trail
- Protected API routes

## Performance Optimizations

- Database indexes on frequently queried fields
- Efficient MongoDB queries with Mongoose
- Frontend code splitting
- Image optimization (Next.js)
- Caching strategies
- Lazy loading components

## Deployment

### Docker Deployment

```bash
# Build all images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment

1. Update environment variables for production
2. Use strong JWT_SECRET
3. Configure MongoDB Atlas connection
4. Set NODE_ENV=production
5. Deploy using Docker or cloud services (AWS, Vercel, Heroku)

## Troubleshooting

### MongoDB Connection Issues
- Check MongoDB is running: `docker ps` (Docker) or `mongod` (local)
- Verify connection string in .env
- Check network connectivity

### API Errors
- Check backend logs: `docker logs crm-backend`
- Verify JWT token is valid
- Check CORS configuration

### Frontend Not Loading
- Clear browser cache
- Check API_URL environment variable
- Verify backend is running on port 5000

## Development

### Code Structure
- Components in `/components` folder
- API calls in `/lib/api.js`
- Authentication utilities in `/lib/auth.js`
- Models in `/backend/src/models/`
- Controllers in `/backend/src/controllers/`

### Adding New Features

1. Create MongoDB model in `backend/src/models/`
2. Create controller in `backend/src/controllers/`
3. Create routes in `backend/src/routes/`
4. Create API function in `frontend/lib/api.js`
5. Create components in `frontend/components/`

## License

MIT License - Feel free to use this project for learning and development.

## Support

For issues and questions, please check the troubleshooting section or review the code documentation.

---

**Last Updated:** June 2026
**Version:** 1.0.0
**Status:** Production Ready

