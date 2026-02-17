import zipfile
import csv
import os
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Route, Stop, Bus
import random

# Create tables
Base.metadata.create_all(bind=engine)

def import_gtfs_data(gtfs_zip_path):
    """Import GTFS data from zip file into database (keeping existing data)"""
    
    db = SessionLocal()
    
    try:
        print("Extracting GTFS data...")
        extract_path = "temp_gtfs"
        
        # Extract zip file
        with zipfile.ZipFile(gtfs_zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_path)
        
        print("Keeping existing data and adding new GTFS routes...")
        
        # Get existing route count
        existing_routes = db.query(Route).count()
        print(f"Existing routes: {existing_routes}")
        
        # Import Routes from routes.txt (add to existing)
        print("Importing new routes from GTFS...")
        routes_file = os.path.join(extract_path, 'routes.txt')
        if os.path.exists(routes_file):
            with open(routes_file, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                route_count = 0
                new_routes = []
                
                for row in reader:
                    # Get route number and name
                    route_short_name = row.get('route_short_name', '').strip()
                    route_id = row.get('route_id', '').strip()
                    route_long_name = row.get('route_long_name', 'Unknown Route').strip()
                    
                    # Use route_id if route_short_name is empty
                    route_number = route_short_name if route_short_name else route_id
                    
                    # Skip if no valid route number
                    if not route_number:
                        continue
                    
                    # Check if route already exists
                    existing = db.query(Route).filter(Route.route_number == route_number).first()
                    if existing:
                        continue
                    
                    # Create route
                    route = Route(
                        route_number=route_number,
                        route_name=route_long_name,
                        start_location=route_long_name.split(' to ')[0] if ' to ' in route_long_name else 'Unknown',
                        end_location=route_long_name.split(' to ')[-1] if ' to ' in route_long_name else 'Unknown',
                        distance_km=random.uniform(10, 50),
                        estimated_duration_minutes=random.randint(30, 120),
                        fare=random.uniform(20, 100),
                        is_active=True
                    )
                    db.add(route)
                    new_routes.append(route)
                    route_count += 1
                    
                    if route_count >= 30:  # Limit new routes to 30
                        break
                
                db.commit()
                print(f"Added {route_count} new routes from GTFS")
        
        # Get all routes for stop assignment
        all_routes = db.query(Route).all()
        print(f"Total routes now: {len(all_routes)}")
        
        # Import Stops from stops.txt (only for new routes)
        print("Importing stops for new routes...")
        stops_file = os.path.join(extract_path, 'stops.txt')
        if os.path.exists(stops_file):
            with open(stops_file, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                stop_count = 0
                stops_per_route = {}
                
                # Initialize counter for new routes only
                for route in new_routes:
                    stops_per_route[route.id] = 0
                
                for row in reader:
                    if not new_routes:
                        break
                    
                    # Assign stops to new routes in round-robin
                    route_index = stop_count % len(new_routes)
                    route = new_routes[route_index]
                    
                    if stops_per_route[route.id] >= 15:
                        continue
                    
                    stops_per_route[route.id] += 1
                    
                    # Create stop
                    stop = Stop(
                        route_id=route.id,
                        stop_name=row.get('stop_name', 'Unknown Stop'),
                        latitude=float(row.get('stop_lat', 28.6139)),
                        longitude=float(row.get('stop_lon', 77.2090)),
                        stop_order=stops_per_route[route.id],
                        estimated_arrival_time=f"{8 + stops_per_route[route.id] // 2}:{(stops_per_route[route.id] * 10) % 60:02d} AM"
                    )
                    db.add(stop)
                    stop_count += 1
                    
                    if stop_count >= 300:  # Limit new stops
                        break
                
                db.commit()
                print(f"Added {stop_count} new stops")
        
        # Assign ALL buses to routes (round-robin across all routes)
        print("Assigning buses to routes...")
        buses = db.query(Bus).all()
        all_routes = db.query(Route).all()
        
        for i, bus in enumerate(buses):
            route = all_routes[i % len(all_routes)]
            bus.route_id = route.id
            print(f"  {bus.bus_number} -> Route {route.route_number}")
        
        db.commit()
        print(f"Assigned {len(buses)} buses to routes")
        
        # Cleanup
        import shutil
        if os.path.exists(extract_path):
            shutil.rmtree(extract_path)
        
        # Final summary
        total_routes = db.query(Route).count()
        total_stops = db.query(Stop).count()
        total_buses = db.query(Bus).count()
        
        print("\n✅ GTFS data import completed successfully!")
        print(f"Total routes: {total_routes} (kept old + added new)")
        print(f"Total stops: {total_stops}")
        print(f"Total buses: {total_buses} (all assigned to routes)")
        
    except Exception as e:
        print(f"❌ Error importing GTFS data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    gtfs_path = r"C:\Project\DTMS\GTFS.zip"
    
    if os.path.exists(gtfs_path):
        print(f"Found GTFS file: {gtfs_path}")
        import_gtfs_data(gtfs_path)
    else:
        print(f"❌ GTFS file not found: {gtfs_path}")
        print("Please ensure the file exists at the specified location.")
