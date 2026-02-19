#!/usr/bin/env python3
"""
Script to add sample live bus locations for demonstration
"""
import sys
import os
import random
from datetime import datetime

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from database import SessionLocal
from models import Bus, LiveBusLocation

def add_live_bus_locations(db: Session):
    """Add live locations for all active buses"""
    
    buses = db.query(Bus).filter(Bus.is_active == True).all()
    
    # Delhi coordinates range (approximate)
    delhi_lat_range = (28.4089, 28.8955)  # Min, Max latitude
    delhi_lng_range = (76.8380, 77.3490)  # Min, Max longitude
    
    locations_added = 0
    
    for bus in buses:
        # Check if location already exists
        existing_location = db.query(LiveBusLocation).filter(
            LiveBusLocation.bus_id == bus.id
        ).first()
        
        # Round coordinates to 6 decimal places for realistic GPS precision
        latitude = round(random.uniform(*delhi_lat_range), 6)
        longitude = round(random.uniform(*delhi_lng_range), 6)
        
        # Round speed to nearest 5 km/h for realistic values
        speed = round(random.uniform(0, 60) / 5) * 5
        
        # Round heading to nearest 10 degrees
        heading = round(random.uniform(0, 360) / 10) * 10
        
        if existing_location:
            # Update existing location
            existing_location.latitude = latitude
            existing_location.longitude = longitude
            existing_location.speed = speed
            existing_location.heading = heading
            existing_location.last_updated = datetime.now()
        else:
            # Create new location
            location = LiveBusLocation(
                bus_id=bus.id,
                latitude=latitude,
                longitude=longitude,
                speed=speed,
                heading=heading,
                last_updated=datetime.now()
            )
            db.add(location)
        
        locations_added += 1
    
    db.commit()
    return locations_added

def main():
    """Main function to add live bus locations"""
    print("Adding live bus locations for demonstration...")
    
    db = SessionLocal()
    try:
        locations_added = add_live_bus_locations(db)
        
        print(f"\nLive locations added/updated successfully!")
        print(f"- Bus locations: {locations_added}")
        
    except Exception as e:
        print(f"Error adding live locations: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()