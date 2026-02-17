-- =====================================================
-- DTMS (Delhi Transit Management System)
-- Complete Database Schema - Updated February 2026
-- PostgreSQL 18.2+
-- =====================================================

-- Drop existing tables (if recreating)
-- Uncomment the following lines to drop all tables
/*
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS metro_cards CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS stops CASCADE;
DROP TABLE IF EXISTS live_bus_locations CASCADE;
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS buses CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS users CASCADE;
*/

-- ==============================
-- 1. USERS TABLE
-- ==============================
-- Stores user accounts (admin, operator, passenger)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'passenger',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ==============================
-- 2. WALLETS TABLE
-- ==============================
-- Stores user wallet balances
CREATE TABLE IF NOT EXISTS wallets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance FLOAT DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create index for wallets
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);

-- ==============================
-- 3. METRO CARDS TABLE
-- ==============================
-- Stores metro card information
CREATE TABLE IF NOT EXISTS metro_cards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    card_number VARCHAR(50) UNIQUE NOT NULL,
    balance FLOAT DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for metro_cards
CREATE INDEX IF NOT EXISTS idx_metro_cards_user_id ON metro_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_metro_cards_card_number ON metro_cards(card_number);

-- ==============================
-- 4. TRANSACTIONS TABLE
-- ==============================
-- Stores wallet transaction history
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    wallet_id INTEGER NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    amount FLOAT NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    description TEXT,
    reference_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for transactions
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- ==============================
-- 5. BUSES TABLE
-- ==============================
-- Stores bus fleet information
CREATE TABLE IF NOT EXISTS buses (
    id SERIAL PRIMARY KEY,
    bus_number VARCHAR(50) UNIQUE NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    capacity INTEGER NOT NULL,
    bus_type VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for buses
CREATE INDEX IF NOT EXISTS idx_buses_bus_number ON buses(bus_number);
CREATE INDEX IF NOT EXISTS idx_buses_is_active ON buses(is_active);

-- ==============================
-- 6. ROUTES TABLE
-- ==============================
-- Stores bus routes
CREATE TABLE IF NOT EXISTS routes (
    id SERIAL PRIMARY KEY,
    route_number VARCHAR(50) UNIQUE NOT NULL,
    route_name VARCHAR(255) NOT NULL,
    bus_id INTEGER REFERENCES buses(id) ON DELETE SET NULL,
    start_location VARCHAR(255) NOT NULL,
    end_location VARCHAR(255) NOT NULL,
    distance_km FLOAT,
    estimated_duration_minutes INTEGER,
    fare FLOAT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for routes
CREATE INDEX IF NOT EXISTS idx_routes_route_number ON routes(route_number);
CREATE INDEX IF NOT EXISTS idx_routes_bus_id ON routes(bus_id);
CREATE INDEX IF NOT EXISTS idx_routes_is_active ON routes(is_active);

-- ==============================
-- 7. STOPS TABLE
-- ==============================
-- Stores bus stops per route
CREATE TABLE IF NOT EXISTS stops (
    id SERIAL PRIMARY KEY,
    route_id INTEGER NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    stop_name VARCHAR(255) NOT NULL,
    stop_order INTEGER NOT NULL,
    latitude FLOAT,
    longitude FLOAT,
    estimated_arrival_time VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for stops
CREATE INDEX IF NOT EXISTS idx_stops_route_id ON stops(route_id);
CREATE INDEX IF NOT EXISTS idx_stops_stop_order ON stops(stop_order);

-- ==============================
-- 8. LIVE BUS LOCATIONS TABLE
-- ==============================
-- Stores real-time GPS tracking
CREATE TABLE IF NOT EXISTS live_bus_locations (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER UNIQUE NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    speed FLOAT DEFAULT 0.0,
    heading FLOAT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for live_bus_locations
CREATE INDEX IF NOT EXISTS idx_live_bus_locations_bus_id ON live_bus_locations(bus_id);
CREATE INDEX IF NOT EXISTS idx_live_bus_locations_last_updated ON live_bus_locations(last_updated);

-- ==============================
-- 9. BOOKINGS TABLE
-- ==============================
-- Stores ticket bookings
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    route_id INTEGER NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    passenger_name VARCHAR(255) NOT NULL,
    passenger_category VARCHAR(50) DEFAULT 'general',
    seat_number VARCHAR(10),
    journey_date TIMESTAMP WITH TIME ZONE NOT NULL,
    fare_amount FLOAT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for bookings
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_route_id ON bookings(route_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_journey_date ON bookings(journey_date);

-- ==============================
-- 10. PAYMENTS TABLE
-- ==============================
-- Stores payment transactions
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE,
    amount FLOAT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for payments
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Note: Run seed_data.py for complete sample data
-- This section provides minimal sample data for testing

-- Insert Sample Admin User (password: admin123)
INSERT INTO users (email, full_name, phone, role, hashed_password, is_active)
VALUES ('admin@smartdtc.com', 'Admin User', '9876543210', 'admin', 
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS3MV7skW', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Insert Sample Wallet for Admin
INSERT INTO wallets (user_id, balance)
SELECT id, 10000.0 FROM users WHERE email = 'admin@smartdtc.com'
ON CONFLICT (user_id) DO NOTHING;

-- Insert Sample Bus
INSERT INTO buses (bus_number, registration_number, capacity, bus_type, is_active)
VALUES ('DTC-100', 'DL-1C-1000', 50, 'Standard', TRUE)
ON CONFLICT (bus_number) DO NOTHING;

-- Insert Sample Route
INSERT INTO routes (route_number, route_name, start_location, end_location, distance_km, estimated_duration_minutes, fare, is_active)
VALUES ('R1', 'Connaught Place - Dwarka', 'Connaught Place', 'Dwarka Sector 21', 25.5, 60, 50, TRUE)
ON CONFLICT (route_number) DO NOTHING;

-- Update route with bus
UPDATE routes SET bus_id = (SELECT id FROM buses WHERE bus_number = 'DTC-100' LIMIT 1)
WHERE route_number = 'R1' AND bus_id IS NULL;

-- Insert Sample Stops
INSERT INTO stops (route_id, stop_name, stop_order, latitude, longitude, estimated_arrival_time)
SELECT id, 'Connaught Place', 1, 28.6315, 77.2167, '8:00 AM' FROM routes WHERE route_number = 'R1'
ON CONFLICT DO NOTHING;

INSERT INTO stops (route_id, stop_name, stop_order, latitude, longitude, estimated_arrival_time)
SELECT id, 'Dwarka Sector 21', 2, 28.5521, 77.0600, '9:00 AM' FROM routes WHERE route_number = 'R1'
ON CONFLICT DO NOTHING;

-- Insert Sample Live Location
INSERT INTO live_bus_locations (bus_id, latitude, longitude, speed, heading)
SELECT id, 28.6139, 77.2090, 45.5, 180.0 FROM buses WHERE bus_number = 'DTC-100'
ON CONFLICT (bus_id) DO UPDATE SET 
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    speed = EXCLUDED.speed,
    heading = EXCLUDED.heading,
    last_updated = NOW();

-- =====================================================
-- USEFUL QUERIES
-- =====================================================

-- Get all active routes with bus information
-- SELECT r.route_number, r.route_name, r.start_location, r.end_location, 
--        b.bus_number, b.bus_type, r.fare
-- FROM routes r
-- LEFT JOIN buses b ON r.bus_id = b.id
-- WHERE r.is_active = TRUE;

-- Get all stops for a specific route in order
-- SELECT stop_name, latitude, longitude, estimated_arrival_time
-- FROM stops
-- WHERE route_id = 1
-- ORDER BY stop_order;

-- Get live location of all active buses
-- SELECT b.bus_number, b.bus_type, l.latitude, l.longitude, 
--        l.speed, l.last_updated
-- FROM buses b
-- JOIN live_bus_locations l ON b.id = l.bus_id
-- WHERE b.is_active = TRUE;

-- Get user bookings with route and payment info
-- SELECT u.full_name, b.booking_reference, r.route_name, 
--        b.journey_date, b.fare_amount, p.status as payment_status
-- FROM bookings b
-- JOIN users u ON b.user_id = u.id
-- JOIN routes r ON b.route_id = r.id
-- LEFT JOIN payments p ON b.id = p.booking_id
-- WHERE u.email = 'admin@smartdtc.com';

-- Get wallet balance and transaction history
-- SELECT u.full_name, w.balance, t.amount, t.transaction_type, 
--        t.description, t.created_at
-- FROM users u
-- JOIN wallets w ON u.id = w.user_id
-- LEFT JOIN transactions t ON w.id = t.wallet_id
-- WHERE u.email = 'admin@smartdtc.com'
-- ORDER BY t.created_at DESC;

-- =====================================================
-- DATABASE STATISTICS
-- =====================================================

-- Get table sizes
-- SELECT 
--     table_name,
--     pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as size
-- FROM information_schema.tables
-- WHERE table_schema = 'public'
-- ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC;

-- Get record counts
-- SELECT 'users' as table_name, COUNT(*) as count FROM users
-- UNION ALL SELECT 'buses', COUNT(*) FROM buses
-- UNION ALL SELECT 'routes', COUNT(*) FROM routes
-- UNION ALL SELECT 'stops', COUNT(*) FROM stops
-- UNION ALL SELECT 'bookings', COUNT(*) FROM bookings
-- UNION ALL SELECT 'payments', COUNT(*) FROM payments
-- UNION ALL SELECT 'wallets', COUNT(*) FROM wallets
-- UNION ALL SELECT 'live_bus_locations', COUNT(*) FROM live_bus_locations;

-- =====================================================
-- MAINTENANCE QUERIES
-- =====================================================

-- Vacuum and analyze database
-- VACUUM ANALYZE;

-- Reindex all tables
-- REINDEX DATABASE DTMS;

-- Check for duplicate records
-- SELECT bus_number, COUNT(*) FROM buses GROUP BY bus_number HAVING COUNT(*) > 1;
-- SELECT route_number, COUNT(*) FROM routes GROUP BY route_number HAVING COUNT(*) > 1;
-- SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
-- Database: DTMS
-- Version: 1.0.0
-- Last Updated: February 2026
-- Tables: 10
-- =====================================================
