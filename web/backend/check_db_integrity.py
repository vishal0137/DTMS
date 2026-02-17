"""
Database Integrity Check Script
"""
from database import SessionLocal
from models import *
from sqlalchemy import func

def check_integrity():
    db = SessionLocal()
    
    print("=" * 60)
    print("Database Integrity Check")
    print("=" * 60)
    print()
    
    # Check for orphaned records
    print("1. Orphaned Records Check:")
    print("-" * 40)
    
    routes_without_buses = db.query(Route).filter(Route.bus_id == None).count()
    print(f"   Routes without buses: {routes_without_buses}")
    
    bookings_without_payments = db.query(Booking).outerjoin(Payment).filter(Payment.id == None).count()
    print(f"   Bookings without payments: {bookings_without_payments}")
    
    buses_without_locations = db.query(Bus).outerjoin(LiveBusLocation).filter(LiveBusLocation.id == None).count()
    print(f"   Buses without live locations: {buses_without_locations}")
    
    users_without_wallets = db.query(User).outerjoin(Wallet).filter(Wallet.id == None).count()
    print(f"   Users without wallets: {users_without_wallets}")
    print()
    
    # Check for duplicates
    print("2. Duplicate Records Check:")
    print("-" * 40)
    
    dup_buses = db.query(Bus.bus_number, func.count(Bus.id).label('count')).group_by(Bus.bus_number).having(func.count(Bus.id) > 1).all()
    print(f"   Duplicate bus numbers: {len(dup_buses)}")
    if dup_buses:
        for bus_num, count in dup_buses:
            print(f"      - {bus_num}: {count} occurrences")
    
    dup_routes = db.query(Route.route_number, func.count(Route.id).label('count')).group_by(Route.route_number).having(func.count(Route.id) > 1).all()
    print(f"   Duplicate route numbers: {len(dup_routes)}")
    if dup_routes:
        for route_num, count in dup_routes:
            print(f"      - {route_num}: {count} occurrences")
    
    dup_users = db.query(User.email, func.count(User.id).label('count')).group_by(User.email).having(func.count(User.id) > 1).all()
    print(f"   Duplicate user emails: {len(dup_users)}")
    if dup_users:
        for email, count in dup_users:
            print(f"      - {email}: {count} occurrences")
    print()
    
    # Check data counts
    print("3. Record Counts:")
    print("-" * 40)
    print(f"   Users: {db.query(User).count()}")
    print(f"   Wallets: {db.query(Wallet).count()}")
    print(f"   Buses: {db.query(Bus).count()}")
    print(f"   Routes: {db.query(Route).count()}")
    print(f"   Stops: {db.query(Stop).count()}")
    print(f"   Bookings: {db.query(Booking).count()}")
    print(f"   Payments: {db.query(Payment).count()}")
    print(f"   Live Locations: {db.query(LiveBusLocation).count()}")
    print(f"   Metro Cards: {db.query(MetroCard).count()}")
    print(f"   Transactions: {db.query(Transaction).count()}")
    print()
    
    # Check for invalid foreign keys
    print("4. Foreign Key Integrity:")
    print("-" * 40)
    
    invalid_route_buses = db.query(Route).filter(Route.bus_id != None).filter(~Route.bus_id.in_(db.query(Bus.id))).count()
    print(f"   Routes with invalid bus_id: {invalid_route_buses}")
    
    invalid_booking_users = db.query(Booking).filter(~Booking.user_id.in_(db.query(User.id))).count()
    print(f"   Bookings with invalid user_id: {invalid_booking_users}")
    
    invalid_booking_routes = db.query(Booking).filter(~Booking.route_id.in_(db.query(Route.id))).count()
    print(f"   Bookings with invalid route_id: {invalid_booking_routes}")
    
    invalid_stops = db.query(Stop).filter(~Stop.route_id.in_(db.query(Route.id))).count()
    print(f"   Stops with invalid route_id: {invalid_stops}")
    print()
    
    print("=" * 60)
    print("Integrity Check Complete")
    print("=" * 60)
    
    db.close()

if __name__ == "__main__":
    check_integrity()
