# Database Maintenance Guide

Complete guide for maintaining the DTMS PostgreSQL database.

## 📋 Table of Contents

1. [Regular Maintenance Tasks](#regular-maintenance-tasks)
2. [Data Integrity Checks](#data-integrity-checks)
3. [Cleanup Operations](#cleanup-operations)
4. [Backup and Restore](#backup-and-restore)
5. [Performance Optimization](#performance-optimization)
6. [Troubleshooting](#troubleshooting)

## 🔧 Regular Maintenance Tasks

### Daily Tasks

#### 1. Check Database Connection
```bash
cd backend
venv\Scripts\activate
python -c "from database import SessionLocal; db = SessionLocal(); print('✅ Connected'); db.close()"
```

#### 2. Verify Record Counts
```bash
python check_db_integrity.py
```

### Weekly Tasks

#### 1. Run Database Cleanup
```bash
cd backend
venv\Scripts\activate
python clean_database.py
```

#### 2. Vacuum Database
```sql
VACUUM ANALYZE;
```

#### 3. Check Table Sizes
```sql
SELECT 
    table_name,
    pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as size
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC;
```

### Monthly Tasks

#### 1. Full Database Backup
```bash
pg_dump -U postgres DTMS > backup_$(date +%Y%m%d).sql
```

#### 2. Reindex Database
```sql
REINDEX DATABASE DTMS;
```

#### 3. Update Statistics
```sql
ANALYZE;
```

## 🔍 Data Integrity Checks

### Check for Orphaned Records

#### Routes Without Buses
```sql
SELECT route_number, route_name 
FROM routes 
WHERE bus_id IS NULL;
```

#### Bookings Without Payments
```sql
SELECT b.booking_reference, b.passenger_name 
FROM bookings b 
LEFT JOIN payments p ON b.id = p.booking_id 
WHERE p.id IS NULL;
```

#### Buses Without Live Locations
```sql
SELECT b.bus_number, b.bus_type 
FROM buses b 
LEFT JOIN live_bus_locations l ON b.id = l.bus_id 
WHERE l.id IS NULL;
```

#### Users Without Wallets
```sql
SELECT u.email, u.full_name 
FROM users u 
LEFT JOIN wallets w ON u.id = w.user_id 
WHERE w.id IS NULL;
```

### Check for Duplicates

#### Duplicate Bus Numbers
```sql
SELECT bus_number, COUNT(*) as count 
FROM buses 
GROUP BY bus_number 
HAVING COUNT(*) > 1;
```

#### Duplicate Route Numbers
```sql
SELECT route_number, COUNT(*) as count 
FROM routes 
GROUP BY route_number 
HAVING COUNT(*) > 1;
```

#### Duplicate User Emails
```sql
SELECT email, COUNT(*) as count 
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;
```

### Check Foreign Key Integrity

#### Invalid Route Bus IDs
```sql
SELECT r.route_number, r.bus_id 
FROM routes r 
WHERE r.bus_id IS NOT NULL 
  AND r.bus_id NOT IN (SELECT id FROM buses);
```

#### Invalid Booking User IDs
```sql
SELECT b.booking_reference, b.user_id 
FROM bookings b 
WHERE b.user_id NOT IN (SELECT id FROM users);
```

#### Invalid Stops Route IDs
```sql
SELECT s.stop_name, s.route_id 
FROM stops s 
WHERE s.route_id NOT IN (SELECT id FROM routes);
```

## 🧹 Cleanup Operations

### Using Python Scripts

#### Run Integrity Check
```bash
cd backend
venv\Scripts\activate
python check_db_integrity.py
```

#### Run Database Cleanup
```bash
python clean_database.py
```

### Manual Cleanup

#### Remove Orphaned Stops
```sql
DELETE FROM stops 
WHERE route_id NOT IN (SELECT id FROM routes);
```

#### Remove Orphaned Bookings
```sql
DELETE FROM bookings 
WHERE user_id NOT IN (SELECT id FROM users) 
   OR route_id NOT IN (SELECT id FROM routes);
```

#### Assign Buses to Routes
```sql
-- Get routes without buses
SELECT id, route_number FROM routes WHERE bus_id IS NULL;

-- Assign a bus to a route
UPDATE routes SET bus_id = 1 WHERE id = 5;
```

#### Remove Duplicate Records
```sql
-- Remove duplicate buses (keep the first one)
DELETE FROM buses 
WHERE id NOT IN (
    SELECT MIN(id) 
    FROM buses 
    GROUP BY bus_number
);
```

## 💾 Backup and Restore

### Create Backup

#### Full Database Backup
```bash
pg_dump -U postgres DTMS > dtms_backup_$(date +%Y%m%d).sql
```

#### Compressed Backup
```bash
pg_dump -U postgres DTMS | gzip > dtms_backup_$(date +%Y%m%d).sql.gz
```

#### Schema Only Backup
```bash
pg_dump -U postgres --schema-only DTMS > dtms_schema_$(date +%Y%m%d).sql
```

#### Data Only Backup
```bash
pg_dump -U postgres --data-only DTMS > dtms_data_$(date +%Y%m%d).sql
```

#### Specific Table Backup
```bash
pg_dump -U postgres -t users -t bookings DTMS > dtms_users_bookings.sql
```

### Restore Backup

#### Restore Full Database
```bash
# Drop existing database
psql -U postgres -c "DROP DATABASE IF EXISTS DTMS;"
psql -U postgres -c "CREATE DATABASE DTMS;"

# Restore from backup
psql -U postgres DTMS < dtms_backup_20260216.sql
```

#### Restore Compressed Backup
```bash
gunzip -c dtms_backup_20260216.sql.gz | psql -U postgres DTMS
```

#### Restore Specific Table
```bash
psql -U postgres DTMS < dtms_users_bookings.sql
```

## ⚡ Performance Optimization

### Analyze Query Performance

#### Enable Query Timing
```sql
\timing on
```

#### Explain Query Plan
```sql
EXPLAIN ANALYZE 
SELECT * FROM routes WHERE is_active = TRUE;
```

### Index Management

#### List All Indexes
```sql
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

#### Create Missing Indexes
```sql
-- If needed, create additional indexes
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
CREATE INDEX idx_routes_fare ON routes(fare);
```

#### Rebuild Indexes
```sql
REINDEX TABLE users;
REINDEX TABLE bookings;
REINDEX DATABASE DTMS;
```

### Vacuum Operations

#### Regular Vacuum
```sql
VACUUM;
```

#### Vacuum with Analyze
```sql
VACUUM ANALYZE;
```

#### Full Vacuum (requires exclusive lock)
```sql
VACUUM FULL;
```

#### Vacuum Specific Table
```sql
VACUUM ANALYZE bookings;
```

### Update Statistics
```sql
ANALYZE;
ANALYZE users;
ANALYZE bookings;
```

## 🔧 Troubleshooting

### Connection Issues

#### Test Connection
```bash
psql -U postgres -d DTMS -c "SELECT version();"
```

#### Check Active Connections
```sql
SELECT 
    datname,
    usename,
    application_name,
    client_addr,
    state,
    query
FROM pg_stat_activity
WHERE datname = 'DTMS';
```

#### Kill Idle Connections
```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'DTMS' 
  AND state = 'idle' 
  AND query_start < NOW() - INTERVAL '1 hour';
```

### Performance Issues

#### Check Slow Queries
```sql
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

#### Check Table Bloat
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Data Issues

#### Check for NULL Values
```sql
SELECT COUNT(*) FROM routes WHERE bus_id IS NULL;
SELECT COUNT(*) FROM users WHERE email IS NULL;
```

#### Check for Invalid Data
```sql
-- Check for negative fares
SELECT * FROM routes WHERE fare < 0;

-- Check for future created_at dates
SELECT * FROM users WHERE created_at > NOW();

-- Check for invalid coordinates
SELECT * FROM stops WHERE latitude < -90 OR latitude > 90;
```

### Lock Issues

#### Check for Locks
```sql
SELECT 
    l.locktype,
    l.database,
    l.relation::regclass,
    l.mode,
    l.granted,
    a.usename,
    a.query
FROM pg_locks l
JOIN pg_stat_activity a ON l.pid = a.pid
WHERE l.database = (SELECT oid FROM pg_database WHERE datname = 'DTMS');
```

#### Kill Blocking Query
```sql
SELECT pg_cancel_backend(pid)
FROM pg_stat_activity
WHERE datname = 'DTMS' AND state = 'active';
```

## 📊 Monitoring

### Database Size
```sql
SELECT pg_size_pretty(pg_database_size('DTMS'));
```

### Table Statistics
```sql
SELECT 
    schemaname,
    tablename,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables
WHERE schemaname = 'public';
```

### Index Usage
```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

## 🔐 Security

### Check User Permissions
```sql
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public';
```

### Update Password
```sql
ALTER USER postgres WITH PASSWORD 'new_password';
```

## 📝 Maintenance Schedule

### Daily
- ✅ Check database connection
- ✅ Monitor error logs
- ✅ Verify backup completion

### Weekly
- ✅ Run integrity checks
- ✅ Run cleanup script
- ✅ Vacuum database
- ✅ Review slow queries

### Monthly
- ✅ Full database backup
- ✅ Reindex database
- ✅ Update statistics
- ✅ Review and optimize indexes
- ✅ Check table bloat

### Quarterly
- ✅ Full vacuum
- ✅ Review and update documentation
- ✅ Performance audit
- ✅ Security audit

---

**Last Updated**: February 2026
**Database Version**: PostgreSQL 18.2
**DTMS Version**: 1.0.0
