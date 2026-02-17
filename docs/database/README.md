# Database Documentation

Complete documentation for the DTMS PostgreSQL database.

## 📋 Contents

1. [Database Setup](#database-setup)
2. [Schema Overview](#schema-overview)
3. [Tables Reference](#tables-reference)
4. [Maintenance](#maintenance)

## 🗄️ Database Setup

### Quick Setup
See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed setup instructions.

**Database Name**: `DTMS`
**PostgreSQL Version**: 18.2+
**Connection String**: `postgresql://postgres:password@localhost:5432/DTMS`

### Files
- [DATABASE_SETUP.md](DATABASE_SETUP.md) - Complete setup guide
- [DTMS_database.sql](DTMS_database.sql) - SQL schema file
- [UPDATE_DATABASE_NAME.md](UPDATE_DATABASE_NAME.md) - Rename database guide

## 📊 Schema Overview

### Core Tables

#### User Management
- **users** - User accounts (admin, operator, passenger)
- **wallets** - User wallet balances
- **metro_cards** - Metro card information
- **transactions** - Wallet transaction history

#### Fleet Management
- **buses** - Bus fleet information
- **live_bus_locations** - Real-time GPS tracking

#### Route Management
- **routes** - Bus routes
- **stops** - Bus stops per route

#### Booking System
- **bookings** - Ticket bookings
- **payments** - Payment transactions

### Entity Relationships

```
users (1) ─── (1) wallets
  │
  ├─── (n) metro_cards
  ├─── (n) bookings
  └─── (n) transactions (via wallets)

buses (1) ─── (1) live_bus_locations
  │
  └─── (n) routes

routes (1) ─── (n) stops
  │
  └─── (n) bookings

bookings (1) ─── (1) payments
```

## 📑 Tables Reference

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'passenger',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);
```

**Roles**: admin, operator, passenger

### Buses Table
```sql
CREATE TABLE buses (
    id SERIAL PRIMARY KEY,
    bus_number VARCHAR(50) UNIQUE NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    capacity INTEGER NOT NULL,
    bus_type VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);
```

**Bus Types**: Standard, AC, Electric, Double Decker

### Routes Table
```sql
CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    route_number VARCHAR(50) UNIQUE NOT NULL,
    route_name VARCHAR(255) NOT NULL,
    bus_id INTEGER REFERENCES buses(id),
    start_location VARCHAR(255) NOT NULL,
    end_location VARCHAR(255) NOT NULL,
    distance_km FLOAT,
    estimated_duration_minutes INTEGER,
    fare FLOAT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);
```

### Stops Table
```sql
CREATE TABLE stops (
    id SERIAL PRIMARY KEY,
    route_id INTEGER REFERENCES routes(id) NOT NULL,
    stop_name VARCHAR(255) NOT NULL,
    stop_order INTEGER NOT NULL,
    latitude FLOAT,
    longitude FLOAT,
    estimated_arrival_time VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    route_id INTEGER REFERENCES routes(id) NOT NULL,
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    passenger_name VARCHAR(255) NOT NULL,
    passenger_category VARCHAR(50) DEFAULT 'general',
    seat_number VARCHAR(10),
    journey_date TIMESTAMP NOT NULL,
    fare_amount FLOAT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);
```

**Statuses**: pending, confirmed, cancelled, completed
**Categories**: general, student, senior, disabled

### Live Bus Locations Table
```sql
CREATE TABLE live_bus_locations (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER REFERENCES buses(id) UNIQUE NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    speed FLOAT DEFAULT 0.0,
    heading FLOAT,
    last_updated TIMESTAMP DEFAULT NOW()
);
```

## 🔧 Database Maintenance

### Backup Database
```bash
pg_dump -U postgres DTMS > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
psql -U postgres DTMS < backup_20260216.sql
```

### Check Database Size
```sql
SELECT pg_size_pretty(pg_database_size('DTMS'));
```

### Check Table Sizes
```sql
SELECT 
    table_name,
    pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as size
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC;
```

### Vacuum Database
```sql
VACUUM ANALYZE;
```

## 📈 Current Statistics

- **Total Tables**: 10
- **Total Records**: ~186
  - Users: 6
  - Buses: 10
  - Routes: 25
  - Stops: 125
  - Bookings: 20

## 🔐 Security

### Password Encoding
Passwords with special characters (like `@`) must be URL-encoded in connection strings:
- `@` becomes `%40`
- Example: `Vi21@189` → `Vi21%40189`

### Connection String Format
```
postgresql://username:password@host:port/database
```

## 🛠️ Common Operations

### Reset Database
```bash
# Drop and recreate
psql -U postgres -c "DROP DATABASE IF EXISTS DTMS;"
psql -U postgres -c "CREATE DATABASE DTMS;"

# Run seed script
cd backend
python seed_data.py
```

### Import Kaggle Data
```bash
cd backend
python download_kaggle_data.py
python import_kaggle_data.py
```

### Check Connection
```bash
psql -U postgres -d DTMS -c "SELECT version();"
```

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Database Schema Diagram](DATABASE_SCHEMA.md)

---

**Database Version**: PostgreSQL 18.2
**Last Updated**: February 2026
