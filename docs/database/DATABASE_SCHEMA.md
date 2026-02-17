# Database Schema Documentation

## Overview

The Smart DTC Platform uses PostgreSQL as the primary database with SQLAlchemy ORM for data management.

## Schema Comparison

### Original DTMS Schema vs Current Implementation

The project integrates the original DTMS database schema with enhanced features:

#### Original DTMS Tables (from DTMS_database.sql)
1. **routes** - Bus route details
2. **stops** - Bus stop locations with GPS
3. **route_stops** - Route-stop mapping
4. **buses** - Bus fleet information
5. **live_bus_locations** - Real-time GPS tracking

#### Enhanced Smart DTC Schema
All original tables PLUS:
6. **users** - User accounts with authentication
7. **wallets** - User wallet balances
8. **metro_cards** - Metro card management
9. **transactions** - Financial transactions
10. **bookings** - Ticket bookings
11. **payments** - Payment processing

## Complete Schema

### 1. Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'passenger',  -- admin, operator, passenger
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
```

### 2. Wallets Table
```sql
CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id),
    balance NUMERIC(10,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_wallets_user_id ON wallets(user_id);
```

### 3. Metro Cards Table
```sql
CREATE TABLE metro_cards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    card_number VARCHAR(50) UNIQUE NOT NULL,
    balance NUMERIC(10,2) DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_metro_cards_user_id ON metro_cards(user_id);
CREATE INDEX idx_metro_cards_card_number ON metro_cards(card_number);
```

### 4. Transactions Table
```sql
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    wallet_id INTEGER REFERENCES wallets(id),
    amount NUMERIC(10,2) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,  -- credit, debit
    description TEXT,
    reference_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);
```

### 5. Buses Table (Enhanced from DTMS)
```sql
CREATE TABLE buses (
    id SERIAL PRIMARY KEY,
    bus_number VARCHAR(50) UNIQUE NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    capacity INTEGER NOT NULL,
    bus_type VARCHAR(50),  -- Standard, AC, Electric, Double Decker
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_buses_bus_number ON buses(bus_number);
CREATE INDEX idx_buses_is_active ON buses(is_active);
```

### 6. Routes Table (Enhanced from DTMS)
```sql
CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    route_number VARCHAR(50) UNIQUE NOT NULL,
    route_name VARCHAR(255) NOT NULL,
    bus_id INTEGER REFERENCES buses(id),
    start_location VARCHAR(255) NOT NULL,
    end_location VARCHAR(255) NOT NULL,
    distance_km NUMERIC(5,2),
    estimated_duration_minutes INTEGER,
    fare NUMERIC(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_routes_route_number ON routes(route_number);
CREATE INDEX idx_routes_bus_id ON routes(bus_id);
```

### 7. Stops Table (Enhanced from DTMS)
```sql
CREATE TABLE stops (
    id SERIAL PRIMARY KEY,
    route_id INTEGER REFERENCES routes(id),
    stop_name VARCHAR(255) NOT NULL,
    stop_order INTEGER NOT NULL,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    estimated_arrival_time VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stops_route_id ON stops(route_id);
```

### 8. Bookings Table
```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    route_id INTEGER REFERENCES routes(id),
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    passenger_name VARCHAR(255) NOT NULL,
    passenger_category VARCHAR(50) DEFAULT 'general',  -- general, student, senior, disabled
    seat_number VARCHAR(10),
    journey_date TIMESTAMP NOT NULL,
    fare_amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',  -- pending, confirmed, cancelled, completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_route_id ON bookings(route_id);
CREATE INDEX idx_bookings_booking_reference ON bookings(booking_reference);
CREATE INDEX idx_bookings_status ON bookings(status);
```

### 9. Payments Table
```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER UNIQUE REFERENCES bookings(id),
    payment_method VARCHAR(50) NOT NULL,  -- card, upi, wallet, cash
    transaction_id VARCHAR(100) UNIQUE,
    amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',  -- pending, success, failed, refunded
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_status ON payments(status);
```

### 10. Live Bus Locations Table (Enhanced from DTMS)
```sql
CREATE TABLE live_bus_locations (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER UNIQUE REFERENCES buses(id),
    latitude NUMERIC(9,6) NOT NULL,
    longitude NUMERIC(9,6) NOT NULL,
    speed NUMERIC(5,2) DEFAULT 0.0,
    heading NUMERIC(5,2),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_live_bus_locations_bus_id ON live_bus_locations(bus_id);
```

## Entity Relationships

```
users (1) ──────── (1) wallets
  │
  ├── (1) ──────── (N) metro_cards
  │
  └── (1) ──────── (N) bookings
                         │
                         ├── (N) ──────── (1) routes
                         │                      │
                         │                      ├── (1) ──────── (N) stops
                         │                      │
                         │                      └── (N) ──────── (1) buses
                         │                                            │
                         │                                            └── (1) ──────── (1) live_bus_locations
                         │
                         └── (1) ──────── (1) payments

wallets (1) ──────── (N) transactions
```

## Key Relationships

1. **User → Wallet**: One-to-One
2. **User → Metro Cards**: One-to-Many
3. **User → Bookings**: One-to-Many
4. **Wallet → Transactions**: One-to-Many
5. **Bus → Routes**: One-to-Many
6. **Bus → Live Location**: One-to-One
7. **Route → Stops**: One-to-Many
8. **Route → Bookings**: One-to-Many
9. **Booking → Payment**: One-to-One

## Migration from DTMS Schema

If you have existing DTMS data, use this migration:

```sql
-- Add new columns to existing tables
ALTER TABLE buses ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 50;
ALTER TABLE buses ADD COLUMN IF NOT EXISTS bus_type VARCHAR(50) DEFAULT 'Standard';
ALTER TABLE buses ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE buses ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE buses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

ALTER TABLE routes ADD COLUMN IF NOT EXISTS route_name VARCHAR(255);
ALTER TABLE routes ADD COLUMN IF NOT EXISTS bus_id INTEGER REFERENCES buses(id);
ALTER TABLE routes ADD COLUMN IF NOT EXISTS fare NUMERIC(10,2) DEFAULT 50.0;
ALTER TABLE routes ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE routes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE routes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

-- Rename columns for consistency
ALTER TABLE routes RENAME COLUMN source_stop TO start_location;
ALTER TABLE routes RENAME COLUMN destination_stop TO end_location;

-- Create new tables
-- (Run the CREATE TABLE statements for users, wallets, metro_cards, transactions, bookings, payments)
```

## Sample Queries

### Get Complete Route Information
```sql
SELECT 
    r.route_number,
    r.route_name,
    r.start_location,
    r.end_location,
    b.bus_number,
    b.bus_type,
    COUNT(s.id) as total_stops
FROM routes r
LEFT JOIN buses b ON r.bus_id = b.id
LEFT JOIN stops s ON s.route_id = r.id
WHERE r.is_active = TRUE
GROUP BY r.id, b.id;
```

### Get User Booking History
```sql
SELECT 
    bk.booking_reference,
    bk.passenger_name,
    r.route_name,
    bk.journey_date,
    bk.fare_amount,
    bk.status,
    p.payment_method,
    p.status as payment_status
FROM bookings bk
JOIN routes r ON bk.route_id = r.id
LEFT JOIN payments p ON p.booking_id = bk.id
WHERE bk.user_id = 1
ORDER BY bk.created_at DESC;
```

### Get Live Bus Locations with Route Info
```sql
SELECT 
    b.bus_number,
    b.bus_type,
    r.route_number,
    r.route_name,
    lbl.latitude,
    lbl.longitude,
    lbl.speed,
    lbl.last_updated
FROM live_bus_locations lbl
JOIN buses b ON lbl.bus_id = b.id
LEFT JOIN routes r ON r.bus_id = b.id
WHERE b.is_active = TRUE;
```

## Performance Optimization

### Recommended Indexes
All critical indexes are already created in the schema above. Additional indexes for specific queries:

```sql
-- For analytics queries
CREATE INDEX idx_bookings_journey_date ON bookings(journey_date);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);

-- For search functionality
CREATE INDEX idx_routes_route_name ON routes(route_name);
CREATE INDEX idx_stops_stop_name ON stops(stop_name);

-- For composite queries
CREATE INDEX idx_bookings_user_status ON bookings(user_id, status);
CREATE INDEX idx_routes_active_bus ON routes(is_active, bus_id);
```

## Database Maintenance

### Regular Maintenance Tasks

```sql
-- Vacuum and analyze tables
VACUUM ANALYZE bookings;
VACUUM ANALYZE payments;
VACUUM ANALYZE live_bus_locations;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

## Backup and Restore

```bash
# Backup
pg_dump -U postgres -d smart_dtc_db > backup_$(date +%Y%m%d).sql

# Restore
psql -U postgres -d smart_dtc_db < backup_20240101.sql
```

## See Also

- [DTMS_database.sql](DTMS_database.sql) - Original DTMS schema
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Database setup instructions
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API endpoints using this schema
