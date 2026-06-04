# Installation Guide

## Prerequisites

Before starting, ensure you have installed:
- Node.js 18+ (download from https://nodejs.org/)
- Docker & Docker Compose (download from https://docker.com/)
- Git (optional, for version control)
- MongoDB Compass (optional, for database visualization)

## Quick Start with Docker (Recommended)

This is the easiest way to get started with all services running.

### Step 1: Navigate to Project Directory

```bash
cd crm-system
```

### Step 2: Start All Services

```bash
docker-compose up -d
```

This command will:
- Pull required images
- Start MongoDB container
- Start Backend API server (port 5000)
- Start Frontend application (port 3000)
- Create necessary networks and volumes

### Step 3: Wait for Services to Start

Wait about 30-60 seconds for all services to fully initialize.

### Step 4: Seed Database (in new terminal)

```bash
docker exec crm-backend npm run seed
```

This creates:
- 2 admin users
- 8 customer users
- 10 customer records
- 15 products
- 12 orders
- 8 deals
- 20+ activity logs

### Step 5: Access Applications

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **MongoDB:** localhost:27017

### Step 6: Login

**Admin Account:**
- Email: admin@example.com
- Password: admin123

**Customer Account:**
- Email: john@company1.com
- Password: password123

---

## Local Development Setup

For development without Docker:

### Backend Setup

#### Step 1: Install MongoDB Locally

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
Download and install from https://www.mongodb.com/try/download/community

**Linux:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

#### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

#### Step 3: Create Environment File

```bash
cp .env.example .env
```

Edit `.env` and ensure MongoDB connection is local:
```
MONGODB_LOCAL=mongodb://localhost:27017/crm-system
```

#### Step 4: Seed Database

```bash
npm run seed
```

#### Step 5: Start Backend Server

```bash
npm run dev
```

Backend will run on http://localhost:5000

---

### Frontend Setup

#### Step 1: Install Frontend Dependencies

```bash
cd frontend
npm install
```

#### Step 2: Create Environment File

```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
```

#### Step 3: Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on http://localhost:3000

---

## Verification

### Check MongoDB Connection

```bash
# From backend directory
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/crm-system').then(() => console.log('Connected!')).catch(e => console.log('Error:', e.message))"
```

### Check Backend API

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"OK","message":"Server is running"}
```

### Check Frontend

Open http://localhost:3000 in browser. You should see the login page.

---

## Troubleshooting

### MongoDB Not Starting

**Error:** "mongod: command not found"

**Solution:**
- Verify MongoDB is installed: `brew info mongodb-community`
- Start MongoDB service: `brew services start mongodb-community`
- Or use Docker: `docker run -d -p 27017:27017 mongo`

### Backend Won't Connect to MongoDB

**Error:** "MongoDB connection failed"

**Solution:**
- Verify MongoDB is running: `ps aux | grep mongod`
- Check connection string in .env
- Try connecting manually: `mongo`

### Port Already in Use

**Error:** "listen EADDRINUSE :::5000" or "listen EADDRINUSE :::3000"

**Solution:**
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Seed Data Not Loading

**Error:** "Cannot connect to MongoDB during seed"

**Solution:**
- Ensure MongoDB is running
- Check MongoDB connection string
- Wait for MongoDB to start (can take 30 seconds)
- Try seed again: `npm run seed`

### CORS Errors

**Error:** "Access to XMLHttpRequest blocked by CORS policy"

**Solution:**
- Verify backend CORS configuration
- Ensure NEXT_PUBLIC_API_URL matches backend URL
- Check both servers are running

### Docker Issues

**Clean restart:**
```bash
# Stop and remove containers
docker-compose down

# Remove volumes
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build
```

---

## Database Backup

### Export Data

```bash
# Local MongoDB
mongodump --db crm-system --out ./backup

# Docker MongoDB
docker exec crm-mongodb mongodump --db crm-system --out /data/backup
```

### Import Data

```bash
# Local MongoDB
mongorestore --db crm-system ./backup/crm-system

# Docker MongoDB
docker exec -i crm-mongodb mongorestore --db crm-system /data/backup/crm-system
```

---

## Production Deployment

### Environment Variables

Update these for production:

```env
# Backend
NODE_ENV=production
JWT_SECRET=<long-random-secure-string>
MONGODB_URI=<your-mongodb-atlas-url>
FRONTEND_URL=<your-frontend-url>

# Frontend
NEXT_PUBLIC_API_URL=<your-api-url>
```

### Deploy to Cloud

**Using Docker on AWS EC2:**

```bash
# Build images
docker-compose -f docker-compose.yml build

# Push to Docker Registry
docker tag crm-backend:latest yourregistry/crm-backend:latest
docker push yourregistry/crm-backend:latest

# Deploy on server
# Pull latest images
docker pull yourregistry/crm-backend:latest
docker pull yourregistry/crm-frontend:latest

# Start services
docker-compose up -d
```

---

## Next Steps

1. ✅ Application is installed
2. ✅ Database is seeded
3. 📊 Explore admin dashboard
4. 👥 View customer records
5. 📦 Manage inventory
6. 📈 Check sales pipeline

Happy coding! 🚀

