# DTMS Web Application

Full-stack web application for Delhi Transport Management System with FastAPI backend and React frontend.

## 📁 Structure

```
web/
├── backend/          # FastAPI backend API
└── frontend/         # React admin dashboard
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL 14+

### Backend Setup

```bash
cd backend
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

Backend runs at: http://localhost:8000

### Frontend Setup

```bash
cd frontend
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```

Frontend runs at: http://localhost:5173

## 🔐 Default Login

- **Email**: `admin@smartdtc.com`
- **Password**: `admin123`

## 📊 Backend (FastAPI)

### Features
- ✅ RESTful API with 40+ endpoints
- ✅ JWT authentication
- ✅ PostgreSQL database with SQLAlchemy ORM
- ✅ Alembic migrations
- ✅ WebSocket support for real-time updates
- ✅ CORS configuration
- ✅ Pydantic validation
- ✅ Comprehensive error handling

### API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints
- `POST /api/auth/login` - User authentication
- `GET /api/buses` - Get all buses
- `GET /api/buses/live-locations` - Live bus tracking
- `GET /api/routes` - Get all routes
- `GET /api/stops` - Get all stops
- `GET /api/bookings` - Get bookings
- `GET /api/users` - Get users
- `GET /api/analytics/*` - Analytics endpoints

### Database Models
- User (authentication & profiles)
- Wallet (digital payments)
- Bus (vehicle management)
- Route (route information)
- Stop (bus stops)
- Booking (ticket bookings)
- Payment (payment records)
- LiveBusLocation (GPS tracking)

## 🖥️ Frontend (React)

### Features
- ✅ Modern admin dashboard
- ✅ Real-time KPI cards
- ✅ Interactive charts (Recharts)
- ✅ Live bus tracking (Leaflet maps)
- ✅ Metro-style route visualization
- ✅ Responsive design (Tailwind CSS)
- ✅ 7 complete pages

### Pages
1. **Dashboard** - Overview with KPIs, charts, and live map
2. **Bus Routes** - View routes by bus
3. **Routes** - Browse all 80 routes
4. **Stops** - Search 800+ bus stops
5. **Bookings** - Manage bookings
6. **Analytics** - Revenue and performance metrics
7. **Users** - User management

### Tech Stack
- React 18
- Tailwind CSS
- Recharts (charts)
- Leaflet (maps)
- Axios (HTTP client)
- Vite (build tool)

## 🗄️ Database

### Setup
1. Install PostgreSQL 14+
2. Create database: `CREATE DATABASE dtms_db;`
3. Update `.env` with credentials
4. Run migrations: `alembic upgrade head`
5. Seed data: `python seed_data.py`

### Sample Data
- 10 buses with GPS tracking
- 80 routes with 800 stops
- 6 users (1 admin + 5 passengers)
- Complete booking records

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Load Testing
```bash
cd ../tests/load
locust -f locustfile.py
```

## 🔧 Development

### Backend Development
```bash
cd backend

# Run with auto-reload
uvicorn main:app --reload

# Check database integrity
python check_db_integrity.py

# Clean database
python clean_database.py

# Import GTFS data
python import_gtfs_data.py
```

### Frontend Development
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Production Build

### Backend
```bash
cd backend

# Install production dependencies
pip install -r requirements.txt

# Run with gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend
```bash
cd frontend

# Build
npm run build

# Output in frontend/dist/
```

## 🌐 Deployment

### Backend Deployment
- Use gunicorn with uvicorn workers
- Set environment variables
- Configure PostgreSQL connection
- Enable HTTPS
- Set up reverse proxy (Nginx)

### Frontend Deployment
- Build static files: `npm run build`
- Deploy to:
  - Vercel
  - Netlify
  - AWS S3 + CloudFront
  - Nginx static hosting

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/dtms_db
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
DEBUG=True
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## 🚨 Troubleshooting

### Backend Issues

**Database Connection Error:**
- Check PostgreSQL is running
- Verify credentials in `.env`
- Ensure database exists
- Check URL encoding for special characters in password

**Import Errors:**
- Activate virtual environment
- Reinstall dependencies: `pip install -r requirements.txt`

**Port Already in Use:**
```bash
# Change port
uvicorn main:app --reload --port 8001
```

### Frontend Issues

**Cannot Connect to API:**
- Verify backend is running
- Check `VITE_API_URL` in `.env`
- Check CORS settings in backend

**Build Errors:**
```bash
# Clear cache
rm -rf node_modules
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

## 📚 Documentation

- [Main Documentation](../README.md)
- [Database Documentation](../docs/database/README.md)
- [API Documentation](../docs/api/API_DOCUMENTATION.md)
- [Setup Guide](../docs/setup/SETUP_GUIDE.md)
- [Mobile App](../mobile/README.md)

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

## 📄 License

MIT License - see [LICENSE](../LICENSE) file.

---

**Built with FastAPI & React** 🚀✨
