# Smart DTC Platform - Complete Setup Guide

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- PostgreSQL 12 or higher
- Git (optional)

## Backend Setup (FastAPI)

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Create Virtual Environment

**Windows:**
```cmd
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Setup PostgreSQL Database

1. Open PostgreSQL command line or pgAdmin
2. Create database:
```sql
CREATE DATABASE smart_dtc_db;
```

3. Create a user (optional):
```sql
CREATE USER dtc_admin WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE smart_dtc_db TO dtc_admin;
```

### Step 5: Configure Environment Variables

1. Copy the example env file:
```bash
# Windows
copy ..\.env.example .env

# Linux/Mac
cp ../.env.example .env
```

2. Edit `.env` file with your database credentials:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/smart_dtc_db
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
DEBUG=True
```

### Step 6: Initialize Database with Alembic

```bash
# Initialize Alembic (first time only)
alembic init alembic

# Run migrations
alembic upgrade head
```

### Step 7: Seed Database with Sample Data

```bash
python seed_data.py
```

This will create:
- Admin user (admin@smartdtc.com / admin123)
- 5 sample users
- 10 buses with live locations
- 5 routes with stops
- 20 sample bookings with payments

### Step 8: Start Backend Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at:
- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

## Frontend Setup (React)

### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables

Create `.env` file:
```bash
# Windows
echo VITE_API_URL=http://localhost:8000 > .env

# Linux/Mac
echo "VITE_API_URL=http://localhost:8000" > .env
```

### Step 4: Start Development Server
```bash
npm run dev
```

Frontend will be available at: http://localhost:5173

## Login Credentials

### Admin Account
- Email: `admin@smartdtc.com`
- Password: `admin123`

### Sample User Accounts
- Email: `user1@example.com` to `user5@example.com`
- Password: `password123`

## Testing the Application

1. Open browser and navigate to http://localhost:5173
2. Login with admin credentials
3. Explore the dashboard with:
   - KPI cards showing real-time metrics
   - Route revenue charts
   - Passenger category distribution
   - Weekly delay analysis
   - Live bus tracking map

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Users
- GET `/api/users/me` - Get current user
- GET `/api/users/` - Get all users
- GET `/api/users/{id}` - Get user by ID

### Buses
- POST `/api/buses/` - Create bus
- GET `/api/buses/` - Get all buses
- GET `/api/buses/{id}` - Get bus by ID
- PUT `/api/buses/{id}` - Update bus
- DELETE `/api/buses/{id}` - Delete bus

### Routes
- POST `/api/routes/` - Create route
- GET `/api/routes/` - Get all routes
- GET `/api/routes/{id}` - Get route by ID
- PUT `/api/routes/{id}` - Update route
- DELETE `/api/routes/{id}` - Delete route

### Bookings
- POST `/api/bookings/` - Create booking
- GET `/api/bookings/` - Get all bookings
- GET `/api/bookings/my-bookings` - Get user bookings
- GET `/api/bookings/{id}` - Get booking by ID
- PUT `/api/bookings/{id}` - Update booking

### Payments
- POST `/api/payments/` - Create payment
- GET `/api/payments/` - Get all payments
- GET `/api/payments/{id}` - Get payment by ID

### Analytics
- GET `/api/analytics/kpis` - Get KPI metrics
- GET `/api/analytics/route-revenue` - Get route revenue data
- GET `/api/analytics/passenger-categories` - Get passenger distribution

### WebSocket
- WS `/ws/live-tracking` - Real-time bus tracking

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env file
- Ensure database exists and user has permissions

### Port Already in Use
- Backend: Change port in uvicorn command `--port 8001`
- Frontend: Change port in vite.config.js

### CORS Issues
- Verify ALLOWED_ORIGINS in .env includes frontend URL
- Check browser console for specific CORS errors

### Module Not Found Errors
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

## Production Deployment

### Backend
1. Set DEBUG=False in .env
2. Change SECRET_KEY to a strong random value
3. Use production WSGI server (gunicorn)
4. Setup SSL/TLS certificates
5. Configure proper CORS origins

### Frontend
1. Build production bundle: `npm run build`
2. Serve from dist/ directory
3. Configure environment variables for production API URL

## Database Migrations

### Create New Migration
```bash
alembic revision --autogenerate -m "description"
```

### Apply Migrations
```bash
alembic upgrade head
```

### Rollback Migration
```bash
alembic downgrade -1
```

## Support

For issues or questions, please check:
- API Documentation: http://localhost:8000/docs
- Database logs in PostgreSQL
- Browser console for frontend errors
- Backend logs in terminal
