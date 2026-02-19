#!/usr/bin/env python3
"""
Script to show summary of current mock data
"""
import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from sqlalchemy import func
from database import SessionLocal
from models import User, Booking, Payment, Route, Bus, LiveBusLocation, BookingStatus, PaymentStatus

def show_data_summary():
    """Show comprehensive summary of mock data"""
    db = SessionLocal()
    try:
        print("=" * 60)
        print("DTMS MOCK DATA SUMMARY")
        print("=" * 60)
        
        # Basic counts
        user_count = db.query(User).count()
        route_count = db.query(Route).count()
        bus_count = db.query(Bus).count()
        active_bus_count = db.query(Bus).filter(Bus.is_active == True).count()
        booking_count = db.query(Booking).count()
        payment_count = db.query(Payment).count()
        location_count = db.query(LiveBusLocation).count()
        
        print(f"\n📊 BASIC STATISTICS")
        print(f"Users: {user_count}")
        print(f"Routes: {route_count}")
        print(f"Buses: {bus_count} (Active: {active_bus_count})")
        print(f"Bookings: {booking_count}")
        print(f"Payments: {payment_count}")
        print(f"Live Locations: {location_count}")
        
        # Revenue statistics
        successful_payments = db.query(Payment).filter(Payment.status == PaymentStatus.SUCCESS).all()
        total_revenue = sum(p.amount for p in successful_payments)
        avg_fare = total_revenue / len(successful_payments) if successful_payments else 0
        
        print(f"\n💰 REVENUE STATISTICS")
        print(f"Total Revenue: ₹{total_revenue:,.2f}")
        print(f"Successful Payments: {len(successful_payments)}")
        print(f"Average Fare: ₹{avg_fare:.2f}")
        
        # Booking status distribution
        booking_stats = db.query(
            Booking.status, 
            func.count(Booking.id).label('count')
        ).group_by(Booking.status).all()
        
        print(f"\n🎫 BOOKING STATUS DISTRIBUTION")
        for status, count in booking_stats:
            print(f"{status.value.title()}: {count}")
        
        # Passenger category distribution
        category_stats = db.query(
            Booking.passenger_category,
            func.count(Booking.id).label('count')
        ).filter(
            Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.COMPLETED])
        ).group_by(Booking.passenger_category).all()
        
        print(f"\n👥 PASSENGER CATEGORIES (Confirmed/Completed)")
        for category, count in category_stats:
            print(f"{category.title()}: {count}")
        
        # Payment method distribution
        payment_method_stats = db.query(
            Payment.payment_method,
            func.count(Payment.id).label('count')
        ).filter(
            Payment.status == PaymentStatus.SUCCESS
        ).group_by(Payment.payment_method).all()
        
        print(f"\n💳 PAYMENT METHODS (Successful)")
        for method, count in payment_method_stats:
            print(f"{method.replace('_', ' ').title()}: {count}")
        
        # Fare amount ranges
        fare_ranges = [
            (0, 25, "₹0-25"),
            (25, 50, "₹25-50"),
            (50, 75, "₹50-75"),
            (75, 100, "₹75-100"),
            (100, float('inf'), "₹100+")
        ]
        
        print(f"\n💵 FARE DISTRIBUTION")
        for min_fare, max_fare, label in fare_ranges:
            if max_fare == float('inf'):
                count = db.query(Booking).filter(Booking.fare_amount >= min_fare).count()
            else:
                count = db.query(Booking).filter(
                    Booking.fare_amount >= min_fare,
                    Booking.fare_amount < max_fare
                ).count()
            print(f"{label}: {count} bookings")
        
        # Bus type distribution
        bus_type_stats = db.query(
            Bus.bus_type,
            func.count(Bus.id).label('count')
        ).group_by(Bus.bus_type).all()
        
        print(f"\n🚌 BUS TYPES")
        for bus_type, count in bus_type_stats:
            print(f"{bus_type}: {count}")
        
        # Sample fare amounts to show rounding
        sample_fares = db.query(Booking.fare_amount).distinct().limit(10).all()
        print(f"\n🔢 SAMPLE ROUNDED FARE AMOUNTS")
        for fare in sorted([f[0] for f in sample_fares])[:10]:
            print(f"₹{fare:.2f}")
        
        print(f"\n" + "=" * 60)
        print("Data is ready for dashboard demonstration!")
        print("=" * 60)
        
    except Exception as e:
        print(f"Error generating summary: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    show_data_summary()