#!/usr/bin/env python3
"""
Script to round existing fare amounts and other values to make them more readable
"""
import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from database import SessionLocal
from models import Booking, Payment, LiveBusLocation
from datetime import datetime

def round_fare_amount(amount):
    """Round fare amount to nearest value divisible by 2 or 5, with 2 decimal places"""
    # Round to 2 decimal places first
    rounded = round(amount, 2)
    
    # Convert to integer cents to work with whole numbers
    cents = int(rounded * 100)
    
    # Find nearest value divisible by 2 or 5 (in cents)
    # Check divisibility by 500 (₹5.00), 200 (₹2.00), 100 (₹1.00), 50 (₹0.50), 20 (₹0.20), 10 (₹0.10)
    for divisor in [500, 200, 100, 50, 20, 10]:
        remainder = cents % divisor
        if remainder == 0:
            return cents / 100
        
        # Round to nearest divisible value
        if remainder <= divisor // 2:
            return (cents - remainder) / 100
        else:
            return (cents + (divisor - remainder)) / 100
    
    # Fallback: round to nearest 10 cents (divisible by 2 and 5)
    return round(cents / 10) * 0.10

def round_existing_bookings(db: Session):
    """Round existing booking fare amounts"""
    bookings = db.query(Booking).all()
    updated_count = 0
    
    for booking in bookings:
        old_fare = booking.fare_amount
        new_fare = round_fare_amount(old_fare)
        
        if old_fare != new_fare:
            booking.fare_amount = new_fare
            updated_count += 1
    
    db.commit()
    return updated_count

def round_existing_payments(db: Session):
    """Round existing payment amounts"""
    payments = db.query(Payment).all()
    updated_count = 0
    
    for payment in payments:
        old_amount = payment.amount
        new_amount = round_fare_amount(old_amount)
        
        if old_amount != new_amount:
            payment.amount = new_amount
            updated_count += 1
    
    db.commit()
    return updated_count

def round_existing_locations(db: Session):
    """Round existing GPS coordinates and speeds"""
    locations = db.query(LiveBusLocation).all()
    updated_count = 0
    
    for location in locations:
        # Round coordinates to 6 decimal places
        old_lat = location.latitude
        old_lng = location.longitude
        old_speed = location.speed
        old_heading = location.heading
        
        new_lat = round(old_lat, 6)
        new_lng = round(old_lng, 6)
        # Round speed to nearest 5 km/h
        new_speed = round(old_speed / 5) * 5
        # Round heading to nearest 10 degrees
        new_heading = round(old_heading / 10) * 10
        
        if (old_lat != new_lat or old_lng != new_lng or 
            old_speed != new_speed or old_heading != new_heading):
            location.latitude = new_lat
            location.longitude = new_lng
            location.speed = new_speed
            location.heading = new_heading
            location.last_updated = datetime.now()
            updated_count += 1
    
    db.commit()
    return updated_count

def main():
    """Main function to round existing data"""
    print("Rounding existing data values...")
    
    db = SessionLocal()
    try:
        # Round booking fares
        print("Rounding booking fare amounts...")
        bookings_updated = round_existing_bookings(db)
        print(f"Updated {bookings_updated} booking fare amounts")
        
        # Round payment amounts
        print("Rounding payment amounts...")
        payments_updated = round_existing_payments(db)
        print(f"Updated {payments_updated} payment amounts")
        
        # Round GPS locations
        print("Rounding GPS coordinates and speeds...")
        locations_updated = round_existing_locations(db)
        print(f"Updated {locations_updated} bus locations")
        
        print(f"\nData rounding completed successfully!")
        print(f"Total updates:")
        print(f"- Bookings: {bookings_updated}")
        print(f"- Payments: {payments_updated}")
        print(f"- Locations: {locations_updated}")
        
    except Exception as e:
        print(f"Error rounding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()