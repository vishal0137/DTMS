# 🚌 DTMS - Delhi Transport Management System

> A modern, real-time transit management platform with live tracking, unified ticketing, and comprehensive analytics.

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ Features

- 🗺️ **Live Bus Tracking** - Real-time GPS tracking with interactive maps
- 📊 **Analytics Dashboard** - Comprehensive KPIs, charts, and insights
- 🎫 **Unified Ticketing** - Complete booking and payment management
- 🚏 **Route Management** - Metro-style route visualization with 80+ routes
- 👥 **User Management** - Role-based access control (Admin/Passenger)
- 💳 **Digital Wallet** - Integrated payment system
- 📱 **Mobile App** - React Native app for iOS and Android
- �️ **Web Dashboard** t- Responsive admin dashboard
- 🔐 **Secure Authentication** - JWT-based auth with bcrypt

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL 14+

### Backend Setup
```bash
cd web/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp ../../.env.example .env
# Edit .env with your database credentials

# Initialize database
python seed_data.py

# Start server
uvicorn main:app --reload
```

Backend runs at: http://localhost:8000

### Frontend Setup
```bash
cd web/frontend
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```

Frontend runs at: http://localhost:5173

### Mobile App Setup
```bash
cd mobile
npm install

# Configure environment
cp .env.example .env
# Update API_URL for your device (see mobile/README.md)

# Start Expo development server
npm start

# Run on Android/iOS
npm run android  # or npm run ios
```

Mobile app runs via Expo Go app on your device.

### Default Login
- **Email**: `admin@smartdtc.com`
- **Password**: `admin123`

## 📁 Project Structure

```
DTMS/
├── web/                        # Web application
│   ├── backend/               # FastAPI backend API
│   │   ├── routers/          # API endpoints
│   │   ├── models.py         # Database models
│   │   ├── schemas.py        # Pydantic schemas
│   │   ├── database.py       # DB configuration
│   │   ├── main.py           # FastAPI app
│   │   └── requirements.txt  # Dependencies
│   └── frontend/             # React admin dashboard
│       ├── src/
│       │   ├── components/   # Reusable components
│       │   ├── pages/        # Page components
│       │   └── api/          # API client
│       └── package.json
├── mobile/                     # React Native mobile app
│   ├── src/
│   │   ├── screens/          # App screens
│   │   ├── navigation/       # Navigation setup
│   │   ├── context/          # Context providers
│   │   └── api/              # API client
│   ├── App.js                # Root component
│   └── package.json
├── docs/                       # Documentation
│   ├── api/                  # API docs
│   ├── database/             # Database docs
│   ├── setup/                # Setup guides
│   └── project/              # Project info
└── tests/                      # Test suites
```

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL + SQLAlchemy ORM
- **Authentication**: JWT + bcrypt
- **Validation**: Pydantic
- **Migrations**: Alembic

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Maps**: Leaflet
- **HTTP Client**: Axios
- **Build Tool**: Vite

### Mobile
- **Framework**: React Native (Expo)
- **UI Library**: React Native Paper
- **Navigation**: React Navigation
- **Maps**: React Native Maps
- **Storage**: AsyncStorage

## 📊 Database

The system includes:
- **10 Buses** with live GPS tracking
- **80 Routes** with 800+ stops
- **6 Users** (1 Admin + 5 Passengers)
- Complete booking and payment records

See [Database Documentation](docs/database/README.md) for schema details.

## 🎯 Key Pages

1. **Dashboard** - Real-time KPIs, charts, and live map
2. **Bus Routes** - View routes by bus with metro-style visualization
3. **Routes** - Browse all 80 routes with detailed stops
4. **Stops** - Search and filter 800+ bus stops
5. **Bookings** - Manage passenger bookings
6. **Analytics** - Revenue trends and performance metrics
7. **Users** - User management and profiles

## 🔌 API Documentation

Interactive API documentation available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

40+ REST API endpoints for complete system control.

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest tests/ -v

# Frontend tests
cd frontend
npm test

# Load testing
cd tests/load
locust -f locustfile.py
```

## 📚 Documentation

- [Quick Start Guide](docs/setup/QUICKSTART.md)
- [Setup Guide](docs/setup/SETUP_GUIDE.md)
- [Database Documentation](docs/database/README.md)
- [API Reference](docs/api/API_DOCUMENTATION.md)
- [Architecture](docs/project/ARCHITECTURE.md)
- [Features](docs/project/FEATURES.md)

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add: AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔐 Security

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- SQL injection prevention
- Environment-based configuration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Delhi Transport Corporation for inspiration
- FastAPI and React communities
- OpenStreetMap for map data

---

**Built with ❤️ for modern transit management** 🚌✨
