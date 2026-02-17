# DTMS Project Structure

Complete project organization for Delhi Transport Management System.

## 📁 Root Structure

```
DTMS/
├── web/                        # Web application (backend + frontend)
├── mobile/                     # React Native mobile app
├── docs/                       # Documentation
├── tests/                      # Test suites
├── .env.example               # Environment template
├── .gitignore                 # Git exclusions
├── README.md                  # Main documentation
├── QUICK_START_GUIDE.md       # Quick start guide
├── QUICK_START.bat            # Windows quick start
├── OPEN_DASHBOARD.bat         # Open dashboard
├── CONTRIBUTING.md            # Contribution guidelines
└── LICENSE                    # MIT License
```

## 🌐 Web Application

```
web/
├── backend/                    # FastAPI Backend
│   ├── routers/               # API route handlers
│   │   ├── analytics.py       # Analytics endpoints
│   │   ├── auth.py            # Authentication
│   │   ├── bookings.py        # Booking management
│   │   ├── buses.py           # Bus operations
│   │   ├── payments.py        # Payment processing
│   │   ├── routes.py          # Route management
│   │   ├── stops.py           # Stop management
│   │   ├── users.py           # User management
│   │   └── websocket.py       # WebSocket support
│   ├── alembic/               # Database migrations
│   │   ├── env.py
│   │   └── script.py.mako
│   ├── venv/                  # Python virtual environment
│   ├── models.py              # SQLAlchemy models
│   ├── schemas.py             # Pydantic schemas
│   ├── database.py            # Database configuration
│   ├── config.py              # App configuration
│   ├── auth_utils.py          # Authentication utilities
│   ├── main.py                # FastAPI application
│   ├── seed_data.py           # Database seeding
│   ├── check_db_integrity.py # Integrity checker
│   ├── clean_database.py     # Database cleanup
│   ├── import_gtfs_data.py   # GTFS data import
│   ├── requirements.txt       # Python dependencies
│   ├── alembic.ini           # Alembic configuration
│   ├── setup.bat             # Windows setup
│   └── setup.sh              # Unix setup
│
└── frontend/                  # React Frontend
    ├── src/
    │   ├── components/        # Reusable components
    │   │   ├── KPICard.jsx
    │   │   ├── Layout.jsx
    │   │   ├── LiveMap.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── TopNav.jsx
    │   ├── pages/             # Page components
    │   │   ├── Analytics.jsx
    │   │   ├── Bookings.jsx
    │   │   ├── BusRoutes.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   ├── Routes.jsx
    │   │   ├── Stops.jsx
    │   │   └── Users.jsx
    │   ├── api/               # API client
    │   │   └── axios.js
    │   ├── App.jsx            # Root component
    │   ├── main.jsx           # Entry point
    │   └── index.css          # Global styles
    ├── public/                # Static assets
    ├── node_modules/          # Node dependencies
    ├── package.json           # Node configuration
    ├── vite.config.js         # Vite configuration
    ├── tailwind.config.js     # Tailwind configuration
    ├── postcss.config.js      # PostCSS configuration
    ├── index.html             # HTML template
    └── .env.example           # Environment template
```

## 📱 Mobile Application

```
mobile/
├── src/
│   ├── screens/               # App screens
│   │   ├── LoginScreen.js
│   │   ├── HomeScreen.js
│   │   ├── RoutesScreen.js
│   │   ├── RouteDetailScreen.js
│   │   ├── BookingsScreen.js
│   │   ├── BookingDetailScreen.js
│   │   └── ProfileScreen.js
│   ├── navigation/            # Navigation setup
│   │   └── AppNavigator.js
│   ├── context/               # Context providers
│   │   └── AuthContext.js
│   └── api/                   # API client
│       └── axios.js
├── assets/                    # Images and icons
├── node_modules/              # Node dependencies
├── App.js                     # Root component
├── app.json                   # Expo configuration
├── babel.config.js            # Babel configuration
├── package.json               # Node configuration
├── .env.example               # Environment template
├── .gitignore                 # Git exclusions
├── README.md                  # Mobile documentation
├── setup.bat                  # Windows setup
└── setup.sh                   # Unix setup
```

## 📚 Documentation

```
docs/
├── api/
│   └── API_DOCUMENTATION.md   # API reference
├── database/
│   ├── README.md              # Database hub
│   ├── DATABASE_SCHEMA.md     # Schema documentation
│   ├── DATABASE_SETUP.md      # Setup instructions
│   ├── DTMS_database.sql      # SQL schema
│   └── MAINTENANCE.md         # Maintenance guide
├── project/
│   ├── ARCHITECTURE.md        # System architecture
│   ├── FEATURES.md            # Feature list
│   ├── PROJECT_OVERVIEW.md    # Project overview
│   ├── PROJECT_STRUCTURE.md   # Structure details
│   └── PROJECT_TREE.md        # File tree
├── setup/
│   ├── QUICKSTART.md          # Quick start
│   ├── SETUP_GUIDE.md         # Detailed setup
│   └── MOBILE_SETUP.md        # Mobile setup
└── README.md                  # Documentation index
```

## 🧪 Tests

```
tests/
├── backend/                   # Backend tests
│   ├── test_auth.py
│   ├── test_buses.py
│   └── test_integration.py
├── load/                      # Load testing
│   └── locustfile.py
└── README.md                  # Testing documentation
```

## 🔑 Key Files

### Configuration Files
- `.env.example` - Environment variable template
- `.gitignore` - Git exclusion rules
- `web/backend/alembic.ini` - Database migration config
- `web/frontend/vite.config.js` - Vite build config
- `web/frontend/tailwind.config.js` - Tailwind CSS config
- `mobile/app.json` - Expo configuration

### Setup Scripts
- `QUICK_START.bat` - Windows quick start
- `OPEN_DASHBOARD.bat` - Open web dashboard
- `web/backend/setup.bat` - Backend setup (Windows)
- `web/backend/setup.sh` - Backend setup (Unix)
- `mobile/setup.bat` - Mobile setup (Windows)
- `mobile/setup.sh` - Mobile setup (Unix)

### Documentation
- `README.md` - Main project documentation
- `QUICK_START_GUIDE.md` - Quick start guide
- `CONTRIBUTING.md` - Contribution guidelines
- `LICENSE` - MIT License
- `web/README.md` - Web application docs
- `mobile/README.md` - Mobile app docs

## 📊 Database Structure

### Tables (10)
1. **users** - User accounts and authentication
2. **wallets** - Digital wallet balances
3. **buses** - Bus fleet information
4. **routes** - Route definitions
5. **stops** - Bus stop locations
6. **bookings** - Ticket bookings
7. **payments** - Payment records
8. **live_bus_locations** - Real-time GPS tracking
9. **alembic_version** - Migration tracking

### Relationships
- User → Wallet (1:1)
- User → Bookings (1:N)
- Bus → Routes (1:N)
- Bus → LiveBusLocation (1:1)
- Route → Stops (1:N)
- Route → Bookings (1:N)
- Booking → Payment (1:1)

## 🚀 Technology Stack

### Backend
- **Framework**: FastAPI 0.104+
- **Database**: PostgreSQL 14+
- **ORM**: SQLAlchemy
- **Migrations**: Alembic
- **Authentication**: JWT + bcrypt
- **Validation**: Pydantic
- **ASGI Server**: Uvicorn

### Frontend (Web)
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Maps**: Leaflet
- **HTTP Client**: Axios
- **Routing**: React Router

### Mobile
- **Framework**: React Native
- **Platform**: Expo
- **UI Library**: React Native Paper
- **Navigation**: React Navigation
- **Maps**: React Native Maps
- **Storage**: AsyncStorage
- **HTTP Client**: Axios

## 📦 Dependencies

### Backend (Python)
- fastapi
- uvicorn
- sqlalchemy
- psycopg2-binary
- alembic
- pydantic
- python-jose
- passlib
- bcrypt
- python-multipart

### Frontend (Node)
- react
- react-dom
- react-router-dom
- axios
- tailwindcss
- recharts
- leaflet
- react-leaflet
- lucide-react

### Mobile (Node)
- expo
- react-native
- react-navigation
- react-native-paper
- react-native-maps
- axios
- @react-native-async-storage/async-storage

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

### Mobile (.env)
```env
API_URL=http://localhost:8000
# Android Emulator: http://10.0.2.2:8000
# Physical Device: http://YOUR_COMPUTER_IP:8000
```

## 📈 Data Scale

- **Buses**: 10 vehicles
- **Routes**: 80 routes
- **Stops**: 800 stops (10 per route)
- **Users**: 6 (1 admin + 5 passengers)
- **API Endpoints**: 40+
- **Frontend Pages**: 7
- **Mobile Screens**: 6

## 🎯 Access Points

### Web Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **API Docs (ReDoc)**: http://localhost:8000/redoc

### Mobile Application
- **Development**: Expo Go app (scan QR code)
- **Android**: `npm run android`
- **iOS**: `npm run ios`

## 🔄 Development Workflow

1. **Start Backend**: `cd web/backend && uvicorn main:app --reload`
2. **Start Frontend**: `cd web/frontend && npm run dev`
3. **Start Mobile**: `cd mobile && npm start`
4. **Run Tests**: `cd tests && pytest` or `npm test`
5. **Check Database**: `python web/backend/check_db_integrity.py`

---

**Last Updated**: February 2026
**Version**: 1.0.0
