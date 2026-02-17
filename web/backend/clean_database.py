"""
Database Cleanup Script
Fixes data integrity issues and assigns buses to routes
"""
from database import SessionLocal
from models import *
from sqlalchemy import func
import random

def clean_database():
    db = SessionLocal()
    
    print("=" * 60)
    print("Database Cleanup")
    print("=" * 60)
    print()
    
    try:
        # 1. Assign buses to routes without buses
        print("1. Assigning buses to routes...")
        print("-" * 40)
        
        routes_without_buses = db.query(Route).filter(Route.bus_id == None).all()
        available_buses = db.query(Bus).all()
        
        if routes_without_buses and available_buses:
            print(f"   Found {len(routes_without_buses)} routes without buses")
            print(f"   Available buses: {len(available_buses)}")
            
            for i, route in enumerate(routes_without_buses):
                # Assign buses in round-robin fashion
                bus = available_buses[i % len(available_buses)]
                route.bus_id = bus.id
                print(f"   ✅ Assigned {bus.bus_number} to route {route.route_number}")
            
            db.commit()
            print(f"   ✅ Assigned buses to {len(routes_without_buses)} routes")
        else:
            print("   ✅ All routes have buses assigned")
        print()
        
        # 2. Remove duplicate records (if any)
        print("2. Checking for duplicates...")
        print("-" * 40)
        
        # Check for duplicate buses
        dup_buses = db.query(Bus.bus_number, func.count(Bus.id).label('count')).group_by(Bus.bus_number).having(func.count(Bus.id) > 1).all()
        if dup_buses:
            print(f"   Found {len(dup_buses)} duplicate bus numbers")
            for bus_num, count in dup_buses:
                buses = db.query(Bus).filter(Bus.bus_number == bus_num).all()
                # Keep the first one, delete the rest
                for bus in buses[1:]:
                    db.delete(bus)
                    print(f"   ✅ Removed duplicate bus: {bus_num}")
            db.commit()
        else:
            print("   ✅ No duplicate buses found")
        
        # Check for duplicate routes
        dup_routes = db.query(Route.route_number, func.count(Route.id).label('count')).group_by(Route.route_number).having(func.count(Route.id) > 1).all()
        if dup_routes:
            print(f"   Found {len(dup_routes)} duplicate route numbers")
            for route_num, count in dup_routes:
                routes = db.query(Route).filter(Route.route_number == route_num).all()
                # Keep the first one, delete the rest
                for route in routes[1:]:
                    # Delete associated stops first
                    db.query(Stop).filter(Stop.route_id == route.id).delete()
                    db.delete(route)
                    print(f"   ✅ Removed duplicate route: {route_num}")
            db.commit()
        else:
            print("   ✅ No duplicate routes found")
        print()
        
        # 3. Clean up orphaned records
        print("3. Cleaning orphaned records...")
        print("-" * 40)
        
        # Remove stops for non-existent routes
        orphaned_stops = db.query(Stop).filter(~Stop.route_id.in_(db.query(Route.id))).count()
        if orphaned_stops > 0:
            db.query(Stop).filter(~Stop.route_id.in_(db.query(Route.id))).delete(synchronize_session=False)
            db.commit()
            print(f"   ✅ Removed {orphaned_stops} orphaned stops")
        else:
            print("   ✅ No orphaned stops found")
        
        # Remove bookings for non-existent routes or users
        orphaned_bookings = db.query(Booking).filter(
            (~Booking.route_id.in_(db.query(Route.id))) | 
            (~Booking.user_id.in_(db.query(User.id)))
        ).count()
        if orphaned_bookings > 0:
            db.query(Booking).filter(
                (~Booking.route_id.in_(db.query(Route.id))) | 
                (~Booking.user_id.in_(db.query(User.id)))
            ).delete(synchronize_session=False)
            db.commit()
            print(f"   ✅ Removed {orphaned_bookings} orphaned bookings")
        else:
            print("   ✅ No orphaned bookings found")
        print()
        
        # 4. Verify data integrity
        print("4. Final verification...")
        print("-" * 40)
        
        routes_without_buses = db.query(Route).filter(Route.bus_id == None).count()
        print(f"   Routes without buses: {routes_without_buses}")
        
        buses_without_locations = db.query(Bus).outerjoin(LiveBusLocation).filter(LiveBusLocation.id == None).count()
        print(f"   Buses without live locations: {buses_without_locations}")
        
        users_without_wallets = db.query(User).outerjoin(Wallet).filter(Wallet.id == None).count()
        print(f"   Users without wallets: {users_without_wallets}")
        
        bookings_without_payments = db.query(Booking).outerjoin(Payment).filter(Payment.id == None).count()
        print(f"   Bookings without payments: {bookings_without_payments}")
        print()
        
        # 5. Display final counts
        print("5. Final Record Counts:")
        print("-" * 40)
        print(f"   Users: {db.query(User).count()}")
        print(f"   Wallets: {db.query(Wallet).count()}")
        print(f"   Buses: {db.query(Bus).count()}")
        print(f"   Routes: {db.query(Route).count()}")
        print(f"   Stops: {db.query(Stop).count()}")
        print(f"   Bookings: {db.query(Booking).count()}")
        print(f"   Payments: {db.query(Payment).count()}")
        print(f"   Live Locations: {db.query(LiveBusLocation).count()}")
        print()
        
        print("=" * 60)
        print("✅ Database Cleanup Complete!")
        print("=" * 60)
        
    except Exception as e:
        print(f"❌ Error during cleanup: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clean_database()
