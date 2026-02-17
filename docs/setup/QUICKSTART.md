# Quick Start Guide

## Prerequisites Check
- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] PostgreSQL 12+ installed and running

## 5-Minute Setup

### 1. Database Setup (2 minutes)
```sql
-- Open PostgreSQL and run:
CREATE DATABASE smart_dtc_db;
```

### 2. Backend Setup (2 minutes)
```bash
# Navigate to backend
cd backend

# Windows
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure database
copy ..\.env.example .env  # Windows
cp ../.env.example .env    # Linux/Mac

# Edit .env and set your DATABASE_URL
# Example: DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/smart_dtc_db

# Seed database
python seed_data.py

# Start server
uvicorn main:app --reload
```

Backend running at: http://localhost:8000

### 3. Frontend Setup (1 minute)
```bash
# Open new terminal
cd frontend

# Install and run
npm install
echo "VITE_API_URL=http://localhost:8000" > .env
npm run dev
```

Frontend running at: http://localhost:5173

### 4. Login
- URL: http://localhost:5173
- Email: `admin@smartdtc.com`
- Password: `admin123`

## What You Get

✅ Full-featured admin dashboard
✅ Real-time KPI metrics
✅ Interactive charts and analytics
✅ Live bus tracking map
✅ Complete REST API with JWT auth
✅ WebSocket support
✅ Sample data (10 buses, 5 routes, 20 bookings)

## Troubleshooting

**Database connection failed?**
- Check PostgreSQL is running
- Verify DATABASE_URL in backend/.env

**Port already in use?**
- Backend: Use `uvicorn main:app --reload --port 8001`
- Frontend: Change port in vite.config.js

**Module not found?**
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt` again

## Next Steps

- Explore API docs: http://localhost:8000/docs
- Check SETUP_GUIDE.md for detailed documentation
- Review API endpoints and test with sample data
