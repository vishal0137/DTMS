"""Check current database data"""
from database import SessionLocal
from models import Route, Stop, Bus

db = SessionLocal()

try:
    routes = db.query(Route).all()
    stops = db.query(Stop).all()
    buses = db.query(Bus).all()
    
    print("=" * 70)
    print("CURRENT DATABASE DATA")
    print("=" * 70)
    print(f"\nTotal Routes: {len(routes)}")
    print(f"Total Stops: {len(stops)}")
    print(f"Total Buses: {len(buses)}")
    
    print("\n" + "=" * 70)
    print("ROUTES DETAILS")
    print("=" * 70)
    for route in routes[:15]:
        route_stops = [s for s in stops if s.route_id == route.id]
        print(f"\n{route.id}. {route.route_number} - {route.route_name}")
        print(f"   Bus ID: {route.bus_id}")
        print(f"   From: {route.start_location}")
        print(f"   To: {route.end_location}")
        print(f"   Distance: {route.distance_km} km | Duration: {route.estimated_duration_minutes} min | Fare: ₹{route.fare}")
        print(f"   Stops: {len(route_stops)}")
    
    print("\n" + "=" * 70)
    print("BUSES DETAILS")
    print("=" * 70)
    for bus in buses[:10]:
        bus_routes = [r for r in routes if r.bus_id == bus.id]
        print(f"\n{bus.id}. {bus.bus_number} ({bus.registration_number})")
        print(f"   Type: {bus.bus_type} | Capacity: {bus.capacity}")
        print(f"   Active: {bus.is_active}")
        print(f"   Routes: {len(bus_routes)}")
        if bus_routes:
            print(f"   Route Numbers: {', '.join([r.route_number for r in bus_routes])}")
    
    # Check for routes without buses
    routes_without_buses = [r for r in routes if r.bus_id is None]
    if routes_without_buses:
        print("\n" + "=" * 70)
        print(f"⚠️  ROUTES WITHOUT BUSES: {len(routes_without_buses)}")
        print("=" * 70)
        for route in routes_without_buses[:5]:
            print(f"   - {route.route_number}: {route.route_name}")
    
    # Check for buses without routes
    buses_without_routes = [b for b in buses if not any(r.bus_id == b.id for r in routes)]
    if buses_without_routes:
        print("\n" + "=" * 70)
        print(f"⚠️  BUSES WITHOUT ROUTES: {len(buses_without_routes)}")
        print("=" * 70)
        for bus in buses_without_routes[:5]:
            print(f"   - {bus.bus_number}: {bus.bus_type}")
    
    print("\n" + "=" * 70)
    print("✅ DATA CHECK COMPLETE")
    print("=" * 70)
    
finally:
    db.close()
