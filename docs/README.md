# Smart DTC Real-Time Transit & Unified Ticketing Platform

A production-ready admin dashboard and backend system for managing real-time transit operations, ticketing, and passenger tracking.

## Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS
- Recharts for data visualization
- Leaflet for live tracking maps
- Axios for API calls

### Backend
- Python FastAPI
- PostgreSQL with SQLAlchemy ORM
- JWT Authentication
- WebSocket for real-time updates
- Alembic for database migrations

## Project Structure

```
├── frontend/          # React application
├── backend/           # FastAPI application
├── .env.example       # Environment variables template
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create PostgreSQL database:
```sql
CREATE DATABASE smart_dtc_db;
```

5. Configure environment variables:
```bash
cp ../.env.example .env
# Edit .env with your database credentials
```

6. Run database migrations:
```bash
alembic upgrade head
```

7. Start the server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will run at: http://localhost:8000
API Documentation: http://localhost:8000/docs

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure API endpoint:
```bash
# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env
```

4. Start development server:
```bash
npm run dev
```

Frontend will run at: http://localhost:5173

## Features

### Admin Dashboard
- Real-time KPI metrics (Active Buses, Revenue, Passengers, On-Time Performance)
- Interactive charts and analytics
- Live bus tracking map
- Route and schedule management
- Booking and payment management
- User and wallet management

### Backend APIs
- JWT-based authentication
- RESTful CRUD operations
- WebSocket for real-time updates
- Comprehensive data models with relationships
- Proper indexing and optimization

## Default Admin Credentials
- Email: admin@smartdtc.com
- Password: admin123

(Change these in production!)
