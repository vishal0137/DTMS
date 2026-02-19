#!/usr/bin/env python3
"""
Script to enhance mock data with more diverse patterns for better dashboard visualization
"""
import sys
import os
from datetime import datetime, timedelta
import random
from faker import Faker

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, Booking, Payment, Route, Bus, UserRole, BookingStatus, PaymentStatus
import uuid

fake = Faker()

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

def add_more_bookings_with_patterns(db: Session):
    """Add more bookings with realistic patterns"""
    
    # Get existing data
    users = db.query(User).all()
    routes = db.query(Route).all()
    
    if not users or not routes:
        print("No users or routes found. Run add_mock_data.py first.")
        return
    
    # Add more bookings for the last 30 days with realistic patterns
    bookings_added = 0
    payments_added = 0
    
    # Popular routes (simulate higher booking frequency)
    popular_routes = random.sample(routes, min(15, len(routes)))
    
    for day_offset in range(30):
        date = datetime.now() - timedelta(days=day_offset)
        
        # Simulate daily booking patterns (more bookings on weekdays)
        if date.weekday() < 5:  # Weekday
            daily_bookings = random.randint(15, 25)
        else:  # Weekend
            daily_bookings = random.randint(8, 15)
        
        for _ in range(daily_bookings):
            # 70% chance for popular routes
            if random.random() < 0.7:
                route = random.choice(popular_routes)
            else:
                route = random.choice(routes)
            
            user = random.choice(users)
            
            # Realistic booking time (mostly during business hours)
            hour = random.choices(
                range(24), 
                weights=[1, 1, 1, 1, 1, 2, 5, 8, 10, 8, 6, 6, 6, 6, 6, 8, 10, 8, 6, 4, 3, 2, 2, 1]
            )[0]
            
            booking_time = date.replace(
                hour=hour, 
                minute=random.randint(0, 59), 
                second=random.randint(0, 59)
            )
            
            journey_time = booking_time + timedelta(
                hours=random.randint(1, 48),
                minutes=random.randint(0, 59)
            )
            
            # Realistic status distribution
            status = random.choices(
                [BookingStatus.CONFIRMED, BookingStatus.COMPLETED, BookingStatus.PENDING, BookingStatus.CANCELLED],
                weights=[40, 35, 15, 10]
            )[0]
            
            # Realistic passenger categories
            category = random.choices(
                ['general', 'student', 'senior', 'disabled', 'child'],
                weights=[50, 25, 15, 5, 5]
            )[0]
            
            # Round fare amount to make it more realistic
            rounded_fare = round_fare_amount(route.fare)
            
            booking = Booking(
                user_id=user.id,
                route_id=route.id,
                booking_reference=f"BK{uuid.uuid4().hex[:8].upper()}",
                passenger_name=fake.name(),
                passenger_category=category,
                seat_number=f"{random.randint(1, 40)}",
                journey_date=journey_time,
                fare_amount=rounded_fare,
                status=status,
                created_at=booking_time
            )
            db.add(booking)
            db.flush()  # This ensures booking.id is available
            bookings_added += 1
            
            # Create corresponding payment
            if status in [BookingStatus.CONFIRMED, BookingStatus.COMPLETED]:
                payment_status = PaymentStatus.SUCCESS
            elif status == BookingStatus.CANCELLED:
                payment_status = random.choice([PaymentStatus.FAILED, PaymentStatus.REFUNDED])
            else:
                payment_status = PaymentStatus.PENDING
            
            payment_method = random.choices(
                ['upi', 'credit_card', 'debit_card', 'wallet', 'cash'],
                weights=[40, 25, 20, 10, 5]
            )[0]
            
            payment = Payment(
                booking_id=booking.id,
                payment_method=payment_method,
                transaction_id=f"TXN{uuid.uuid4().hex[:12].upper()}",
                amount=booking.fare_amount,
                status=payment_status,
                payment_date=booking_time + timedelta(minutes=random.randint(1, 15)),
                created_at=booking_time + timedelta(minutes=random.randint(1, 15))
            )
            db.add(payment)
            payments_added += 1
    
    db.commit()
    return bookings_added, payments_added

def main():
    """Main function to enhance mock data"""
    print("Enhancing mock data with realistic patterns...")
    
    db = SessionLocal()
    try:
        bookings_added, payments_added = add_more_bookings_with_patterns(db)
        
        print(f"\nEnhancement completed successfully!")
        print(f"- Additional Bookings: {bookings_added}")
        print(f"- Additional Payments: {payments_added}")
        
        # Get updated statistics
        from models import Payment, Booking
        successful_payments = db.query(Payment).filter(Payment.status == PaymentStatus.SUCCESS).all()
        total_revenue = sum(p.amount for p in successful_payments)
        confirmed_bookings = db.query(Booking).filter(
            Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.COMPLETED])
        ).count()
        
        print(f"\nUpdated Statistics:")
        print(f"- Total Revenue: ₹{total_revenue:,.2f}")
        print(f"- Total Confirmed Passengers: {confirmed_bookings}")
        
    except Exception as e:
        print(f"Error enhancing mock data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()