# Project Structure

```
smart-dtc-platform/
│
├── backend/                          # FastAPI Backend
│   ├── alembic/                      # Database migrations
│   │   ├── env.py                    # Alembic environment config
│   │   └── script.py.mako            # Migration template
│   │
│   ├── routers/                      # API route handlers
│   │   ├── __init__.py
│   │   ├── auth.py                   # Authentication endpoints
│   │   ├── users.py                  # User management
│   │   ├── buses.py                  # Bus CRUD operations
│   │   ├── routes.py                 # Route management
│   │   ├── stops.py                  # Stop management
│   │   ├── bookings.py               # Booking operations
│   │   ├── payments.py               # Payment processing
│   │   ├── analytics.py              # Analytics & KPIs
│   │   └── websocket.py              # Real-time updates
│   │
│   ├── main.py                       # FastAPI application entry
│   ├── database.py                   # Database connection & session
│   ├── models.py                     # SQLAlchemy ORM models
│   ├── schemas.py                    # Pydantic schemas
│   ├── auth_utils.py                 # JWT & password utilities
│   ├── config.py                     # Configuration settings
│   ├── seed_data.py                  # Database seeding script
│   ├── requirements.txt              # Python dependencies
│   ├── alembic.ini                   # Alembic configuration
│   ├── setup.bat                     # Windows setup script
│   └── setup.sh                      # Linux/Mac setup script
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js              # Axios instance & interceptors
│   │   │
│   │   ├── components/
│   │   │   ├── Layout.jsx            # Main layout wrapper
│   │   │   ├── Sidebar.jsx           # Navigation sidebar
│   │   │   ├── TopNav.jsx            # Top navigation bar
│   │   │   ├── KPICard.jsx           # KPI metric card
│   │   │   └── LiveMap.jsx           # Leaflet map component
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Login page
│   │   │   └── Dashboard.jsx         # Main dashboard
│   │   │
│   │   ├── App.jsx                   # Root component
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global styles
│   │
│   ├── index.html                    # HTML template
│   ├── package.json                  # Node dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── tailwind.config.js            # Tailwind CSS config
│   ├── postcss.config.js             # PostCSS config
│   └── .env.example                  # Environment variables template
│
├── .env.example                      # Backend env template
├── .gitignore                        # Git ignore rules
├── README.md                         # Project overview
├── SETUP_GUIDE.md                    # Detailed setup instructions
├── QUICKSTART.md                     # Quick start guide
└── PROJECT_STRUCTURE.md              # This file

```

## Key Components

### Backend Architecture

**Database Models (models.py)**
- User: User accounts with roles
- Wallet: User wallet balances
- MetroCard: Metro card management
- Transaction: Wallet transactions
- Bus: Bus fleet management
- Route: Route definitions
- Stop: Bus stops along routes
- Booking: Ticket bookings
- Payment: Payment records
- LiveBusLocation: Real-time GPS tracking

**API Routers**
- `/api/auth/*` - Authentication & registration
- `/api/users/*` - User management
- `/api/buses/*` - Bus CRUD operations
- `/api/routes/*` - Route management
- `/api/stops/*` - Stop management
- `/api/bookings/*` - Booking operations
- `/api/payments/*` - Payment processing
- `/api/analytics/*` - KPIs and analytics
- `/ws/*` - WebSocket endpoints

**Key Features**
- JWT-based authentication
- SQLAlchemy ORM with PostgreSQL
- Alembic database migrations
- CORS middleware
- WebSocket support
- Comprehensive error handling

### Frontend Architecture

**Components**
- Layout: Responsive layout with sidebar
- Sidebar: Navigation menu
- TopNav: Header with user info
- KPICard: Metric display cards
- LiveMap: Real-time bus tracking

**Pages**
- Login: Authentication page
- Dashboard: Main analytics dashboard

**Features**
- React Router for navigation
- Axios for API calls
- Recharts for data visualization
- Leaflet for maps
- Tailwind CSS for styling
- JWT token management

## Data Flow

1. **Authentication Flow**
   - User submits credentials → `/api/auth/login`
   - Backend validates → Returns JWT token
   - Frontend stores token → Includes in all requests

2. **Dashboard Data Flow**
   - Dashboard loads → Fetches analytics data
   - `/api/analytics/kpis` → KPI metrics
   - `/api/analytics/route-revenue` → Revenue charts
   - `/api/analytics/passenger-categories` → Distribution data

3. **Real-time Updates**
   - WebSocket connection → `/ws/live-tracking`
   - Backend broadcasts location updates
   - Frontend updates map markers

## Database Schema

**Core Tables**
- users (id, email, full_name, role, hashed_password)
- wallets (id, user_id, balance)
- buses (id, bus_number, registration_number, capacity)
- routes (id, route_number, route_name, bus_id, fare)
- stops (id, route_id, stop_name, stop_order, lat, lng)
- bookings (id, user_id, route_id, booking_reference, status)
- payments (id, booking_id, transaction_id, amount, status)
- live_bus_locations (id, bus_id, latitude, longitude, speed)

**Relationships**
- User → Wallet (one-to-one)
- User → Bookings (one-to-many)
- Bus → Routes (one-to-many)
- Route → Stops (one-to-many)
- Route → Bookings (one-to-many)
- Booking → Payment (one-to-one)
- Bus → LiveBusLocation (one-to-one)

## Technology Stack

**Backend**
- FastAPI 0.109.0
- SQLAlchemy 2.0.25
- PostgreSQL (psycopg2-binary)
- Alembic 1.13.1
- Python-Jose (JWT)
- Passlib (password hashing)
- Uvicorn (ASGI server)

**Frontend**
- React 18.2.0
- Vite 5.0.11
- Tailwind CSS 3.4.1
- React Router 6.21.0
- Axios 1.6.5
- Recharts 2.10.3
- Leaflet 1.9.4
- Lucide React (icons)

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- SQL injection prevention (ORM)
- Environment variable configuration
- Token expiration handling
