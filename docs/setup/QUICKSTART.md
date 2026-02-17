# Quick Start Guide

## Prerequisites

| Requirement | Minimum Version | Status |
|------------|----------------|--------|
| Python | 3.8+ | Required |
| Node.js | 16+ | Required |
| PostgreSQL | 12+ | Required |

## Setup Timeline

```
Total Time: 5 minutes
├── Database Setup: 2 minutes
├── Backend Setup: 2 minutes
└── Frontend Setup: 1 minute
```

## Step 1: Database Setup (2 minutes)

Open PostgreSQL and execute:

```sql
CREATE DATABASE smart_dtc_db;
```

## Step 2: Backend Setup (2 minutes)

Navigate to backend directory:

```bash
cd web/backend
```

Create and activate virtual environment:

**Windows:**
```cmd
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Configure environment:

```bash
# Windows
copy ..\.env.example .env

# Linux/Mac
cp ../.env.example .env
```

Edit `.env` file and set DATABASE_URL:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/smart_dtc_db
```

Initialize database with sample data:

```bash
python seed_data.py
```

Start backend server:

```bash
uvicorn main:app --reload
```

Backend URL: http://localhost:8000

## Step 3: Frontend Setup (1 minute)

Open new terminal and navigate to frontend:

```bash
cd web/frontend
npm install
```

Create environment file:

```bash
# Windows
echo VITE_API_URL=http://localhost:8000 > .env

# Linux/Mac
echo "VITE_API_URL=http://localhost:8000" > .env
```

Start frontend server:

```bash
npm run dev
```

Frontend URL: http://localhost:5173

## Step 4: Login

| Parameter | Value |
|-----------|-------|
| URL | http://localhost:5173 |
| Email | admin@smartdtc.com |
| Password | admin123 |

## Included Features

| Feature | Description |
|---------|-------------|
| Admin Dashboard | Full-featured management interface |
| KPI Metrics | Real-time performance indicators |
| Analytics | Interactive charts and visualizations |
| Live Tracking | Real-time bus location monitoring |
| REST API | Complete API with JWT authentication |
| WebSocket | Real-time data streaming |
| Sample Data | 10 buses, 80 routes, 800 stops |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection failed | Verify PostgreSQL is running and DATABASE_URL is correct |
| Port already in use (Backend) | Use `uvicorn main:app --reload --port 8001` |
| Port already in use (Frontend) | Change port in vite.config.js |
| Module not found | Activate virtual environment and run `pip install -r requirements.txt` |

## Next Steps

| Resource | URL |
|----------|-----|
| API Documentation | http://localhost:8000/docs |
| Detailed Setup Guide | docs/setup/SETUP_GUIDE.md |
| API Endpoints | docs/api/API_DOCUMENTATION.md |
