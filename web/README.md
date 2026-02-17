# DTMS Web Application

Full-stack web application for Delhi Transport Management System with FastAPI backend and React frontend.

## Structure

```
web/
├── backend/          # FastAPI backend API
└── frontend/         # React admin dashboard
```

## Quick Start

### Prerequisites

| Requirement | Version | Purpose |
|------------|---------|---------|
| Python | 3.9+ | Backend runtime |
| Node.js | 16+ | Frontend runtime |
| PostgreSQL | 14+ | Database |

### Backend Setup

```bash
cd web/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp ../.env.example .env
# Edit .env with your database credentials

# Initialize database
python seed_data.py

# Start server
uvicorn main:app --reload
```

Backend URL: http://localhost:8000

### Frontend Setup

```bash
cd web/frontend
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```

Frontend URL: http://localhost:5173

## Default Login

| Field | Value |
|-------|-------|
| Email | admin@smartdtc.com |
| Password | admin123 |

## Backend (FastAPI)

### Features

| Feature | Description |
|---------|-------------|
| RESTful API | 40+ endpoints |
| JWT Authentication | Secure token-based auth |
| PostgreSQL Database | SQLAlchemy ORM |
| Alembic Migrations | Database versioning |
| WebSocket Support | Real-time updates |
| CORS Configuration | Cross-origin support |
| Pydantic Validation | Request/response validation |
| Error Handling | Comprehensive error management |

### API Documentation

| Documentation | URL | Purpose |
|--------------|-----|---------|
| Swagger UI | http://localhost:8000/docs | Interactive testing |
| ReDoc | http://localhost:8000/redoc | Clean reference |

### Key Endpoints

| Category | Endpoints | Authentication |
|----------|-----------|---------------|
| Authentication | POST /api/auth/login, /register | No |
| Buses | GET, POST, PUT, DELETE /api/buses | Yes |
| Routes | GET, POST, PUT, DELETE /api/routes | Yes |
| Stops | GET, POST /api/stops | Yes |
| Bookings | GET, POST, PUT /api/bookings | Yes |
| Users | GET /api/users | Yes |
| Analytics | GET /api/analytics/* | No |

### Database Models

| Model | Purpose | Relationships |
|-------|---------|---------------|
| User | Authentication & profiles | 1:1 Wallet, 1:N Bookings |
| Wallet | Digital payments | N:1 User |
| Bus | Vehicle management | 1:N Routes, 1:1 Location |
| Route | Route information | N:1 Bus, 1:N Stops |
| Stop | Bus stops | N:1 Route |
| Booking | Ticket bookings | N:1 User, N:1 Route, 1:1 Payment |
| Payment | Payment records | 1:1 Booking |
| LiveBusLocation | GPS tracking | 1:1 Bus |

## Frontend (React)

### Features

| Feature | Technology | Status |
|---------|-----------|--------|
| Admin Dashboard | React 18 | Complete |
| KPI Cards | Custom components | Complete |
| Interactive Charts | Recharts | Complete |
| Live Tracking | Leaflet maps | Complete |
| Route Visualization | Custom design | Complete |
| Responsive Design | Tailwind CSS | Complete |
| Pages | 7 complete pages | Complete |

### Pages

| Page | Purpose | Features |
|------|---------|----------|
| Dashboard | Overview | KPIs, charts, live map |
| Bus Routes | Routes by bus | Bus fleet, route assignments |
| Routes | All routes | 80 routes, search, timeline view |
| Stops | Bus stops | 800+ stops, search |
| Bookings | Booking management | Status tracking |
| Analytics | Performance metrics | Revenue, trends |
| Users | User management | CRUD operations |

### Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Framework | React 18 | UI library |
| Styling | Tailwind CSS | Responsive design |
| Charts | Recharts | Data visualization |
| Maps | Leaflet | Location tracking |
| HTTP Client | Axios | API communication |
| Build Tool | Vite | Fast development |

## Database

### Setup Steps

| Step | Command | Purpose |
|------|---------|---------|
| 1 | Install PostgreSQL 14+ | Database server |
| 2 | `CREATE DATABASE dtms_db;` | Create database |
| 3 | Update `.env` | Configure connection |
| 4 | `alembic upgrade head` | Run migrations |
| 5 | `python seed_data.py` | Load sample data |

### Sample Data

| Data Type | Count | Details |
|-----------|-------|---------|
| Buses | 10 | With GPS tracking |
| Routes | 80 | Complete network |
| Stops | 800 | GPS coordinates |
| Users | 6 | 1 admin + 5 passengers |
| Bookings | Sample set | Complete records |

## Testing

### Backend Tests
```bash
cd web/backend
pytest tests/ -v
```

### Frontend Tests
```bash
cd web/frontend
npm test
```

### Load Testing
```bash
cd ../tests/load
locust -f locustfile.py
```

## Development

### Backend Development

| Command | Purpose |
|---------|---------|
| `uvicorn main:app --reload` | Run with auto-reload |
| `python check_db_integrity.py` | Check database |
| `python clean_database.py` | Clean database |
| `python import_gtfs_data.py` | Import GTFS data |

### Frontend Development

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview build |

## Production Build

### Backend

```bash
cd web/backend

# Install production dependencies
pip install -r requirements.txt

# Run with gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend

```bash
cd web/frontend

# Build
npm run build

# Output in frontend/dist/
```

## Deployment

### Backend Deployment

| Step | Action |
|------|--------|
| 1 | Use gunicorn with uvicorn workers |
| 2 | Set environment variables |
| 3 | Configure PostgreSQL connection |
| 4 | Enable HTTPS |
| 5 | Set up reverse proxy (Nginx) |

### Frontend Deployment

Build static files and deploy to:

| Platform | Type | Benefit |
|----------|------|---------|
| Vercel | Serverless | Easy deployment |
| Netlify | Serverless | CI/CD integration |
| AWS S3 + CloudFront | CDN | Scalable |
| Nginx | Static hosting | Full control |

## Environment Variables

### Backend (.env)

| Variable | Example | Purpose |
|----------|---------|---------|
| DATABASE_URL | postgresql://user:pass@localhost:5432/dtms_db | Database connection |
| SECRET_KEY | your-secret-key-min-32-chars | JWT signing |
| ALGORITHM | HS256 | JWT algorithm |
| ACCESS_TOKEN_EXPIRE_MINUTES | 30 | Token expiration |
| ALLOWED_ORIGINS | http://localhost:5173 | CORS origins |
| DEBUG | True | Debug mode |

### Frontend (.env)

| Variable | Example | Purpose |
|----------|---------|---------|
| VITE_API_URL | http://localhost:8000 | Backend API URL |

## Troubleshooting

### Backend Issues

| Issue | Solution |
|-------|----------|
| Database Connection Error | Check PostgreSQL running, verify credentials, ensure database exists, check URL encoding for special characters |
| Import Errors | Activate virtual environment, reinstall: `pip install -r requirements.txt` |
| Port Already in Use | Change port: `uvicorn main:app --reload --port 8001` |

### Frontend Issues

| Issue | Solution |
|-------|----------|
| Cannot Connect to API | Verify backend running, check `VITE_API_URL` in `.env`, check CORS settings |
| Build Errors | Clear cache: `rm -rf node_modules && npm install`, clear Vite cache: `rm -rf node_modules/.vite` |

## Documentation

| Document | Path | Purpose |
|----------|------|---------|
| Main Documentation | ../README.md | Project overview |
| Database Documentation | ../docs/database/README.md | Database schema |
| API Documentation | ../docs/api/API_DOCUMENTATION.md | API reference |
| Setup Guide | ../docs/setup/SETUP_GUIDE.md | Detailed setup |
| Mobile App | ../mobile/README.md | Mobile application |

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

## License

MIT License - see [LICENSE](../LICENSE) file.
