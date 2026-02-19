#!/usr/bin/env python3
"""
Script to add mock data for dashboard demonstration
"""
import sys
import os
from datetime import datetime, timedelta
import random
from faker import Faker

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import User, Booking, Payment, Route, Bus, UserRole, BookingStatus, PaymentStatus
import uuid

fake = Faker()

def create_mock_users(db: Session, count: int = 50):
    """Create mock users"""
    users = []
    for i in range(count):
        user = User(
            email=fake.email(),
            full_name=fake.name(),
            phone=fake.phone_number()[:15],
            hashed_password="$2b$12$dummy_hash",  # Dummy hash
            role=UserRole.PASSENGER,
            is_active=True,
            created_at=fake.date_time_between(start_date='-1y', end_date='now')
        )
        db.add(user)
        users.append(user)
    
    db.commit()
    return users

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

def create_mock_bookings(db: Session, users: list, routes: list, count: int = 200):
    """Create mock bookings"""
    passenger_categories = ['general', 'student', 'senior', 'disabled', 'child']
    booking_statuses = [BookingStatus.CONFIRMED, BookingStatus.COMPLETED, BookingStatus.PENDING, BookingStatus.CANCELLED]
    
    bookings = []
    for i in range(count):
        route = random.choice(routes)
        user = random.choice(users)
        
        # Generate booking date within last 3 months
        booking_date = fake.date_time_between(start_date='-3M', end_date='now')
        journey_date = booking_date + timedelta(days=random.randint(0, 30))
        
        # Round fare amount to make it more realistic
        rounded_fare = round_fare_amount(route.fare)
        
        booking = Booking(
            user_id=user.id,
            route_id=route.id,
            booking_reference=f"BK{uuid.uuid4().hex[:8].upper()}",
            passenger_name=fake.name(),
            passenger_category=random.choice(passenger_categories),
            seat_number=f"{random.randint(1, 40)}",
            journey_date=journey_date,
            fare_amount=rounded_fare,
            status=random.choice(booking_statuses),
            created_at=booking_date
        )
        db.add(booking)
        bookings.append(booking)
    
    db.commit()
    return bookings

def create_mock_payments(db: Session, bookings: list):
    """Create mock payments for bookings"""
    payment_methods = ['credit_card', 'debit_card', 'upi', 'wallet', 'cash']
    
    payments = []
    for booking in bookings:
        # Only create payments for confirmed/completed bookings
        if booking.status in [BookingStatus.CONFIRMED, BookingStatus.COMPLETED]:
            payment_status = PaymentStatus.SUCCESS
        elif booking.status == BookingStatus.CANCELLED:
            payment_status = random.choice([PaymentStatus.FAILED, PaymentStatus.REFUNDED])
        else:
            payment_status = PaymentStatus.PENDING
        
        payment = Payment(
            booking_id=booking.id,
            payment_method=random.choice(payment_methods),
            transaction_id=f"TXN{uuid.uuid4().hex[:12].upper()}",
            amount=booking.fare_amount,
            status=payment_status,
            payment_date=booking.created_at + timedelta(minutes=random.randint(1, 30)),
            created_at=booking.created_at + timedelta(minutes=random.randint(1, 30))
        )
        db.add(payment)
        payments.append(payment)
    
    db.commit()
    return payments

def main():
    """Main function to create all mock data"""
    print("Creating mock data for dashboard demonstration...")
    
    db = SessionLocal()
    try:
        # Get existing routes and buses
        routes = db.query(Route).all()
        buses = db.query(Bus).all()
        
        if not routes:
            print("No routes found in database. Please run the GTFS import first.")
            return
        
        print(f"Found {len(routes)} routes and {len(buses)} buses")
        
        # Create mock users
        print("Creating mock users...")
        users = create_mock_users(db, count=50)
        print(f"Created {len(users)} users")
        
        # Create mock bookings
        print("Creating mock bookings...")
        bookings = create_mock_bookings(db, users, routes, count=200)
        print(f"Created {len(bookings)} bookings")
        
        # Create mock payments
        print("Creating mock payments...")
        payments = create_mock_payments(db, bookings)
        print(f"Created {len(payments)} payments")
        
        print("\nMock data creation completed successfully!")
        print("\nSummary:")
        print(f"- Users: {len(users)}")
        print(f"- Bookings: {len(bookings)}")
        print(f"- Payments: {len(payments)}")
        print(f"- Routes: {len(routes)}")
        print(f"- Buses: {len(buses)}")
        
        # Calculate some stats
        successful_payments = [p for p in payments if p.status == PaymentStatus.SUCCESS]
        total_revenue = sum(p.amount for p in successful_payments)
        confirmed_bookings = [b for b in bookings if b.status in [BookingStatus.CONFIRMED, BookingStatus.COMPLETED]]
        
        print(f"\nGenerated Statistics:")
        print(f"- Total Revenue: ₹{total_revenue:,.2f}")
        print(f"- Confirmed Passengers: {len(confirmed_bookings)}")
        print(f"- Active Buses: {len([b for b in buses if b.is_active])}")
        
    except Exception as e:
        print(f"Error creating mock data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()