from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import User, Bus, Route, Stop, Booking, Payment, Wallet, LiveBusLocation
from models import UserRole, BookingStatus, PaymentStatus
from auth_utils import get_password_hash
from datetime import datetime, timedelta
import random

def seed_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(User).first():
            print("Database already seeded!")
            return
        
        print("Seeding database...")
        
        # Create admin user
        admin = User(
            email="admin@smartdtc.com",
            full_name="Admin User",
            phone="9876543210",
            role=UserRole.ADMIN,
            hashed_password=get_password_hash("admin123"),
            is_active=True
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        
        # Create wallet for admin
        admin_wallet = Wallet(user_id=admin.id, balance=10000.0)
        db.add(admin_wallet)
        
        # Create sample users
        users = []
        for i in range(5):
            user = User(
                email=f"user{i+1}@example.com",
                full_name=f"User {i+1}",
                phone=f"98765432{i+1}{i+1}",
                role=UserRole.PASSENGER,
                hashed_password=get_password_hash("password123"),
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            users.append(user)
            
            # Create wallet for each user
            wallet = Wallet(user_id=user.id, balance=random.uniform(500, 5000))
            db.add(wallet)
        
        # Create buses
        buses = []
        bus_types = ["Standard", "AC", "Electric", "Double Decker"]
        for i in range(10):
            bus = Bus(
                bus_number=f"DTC-{100+i}",
                registration_number=f"DL-1C-{1000+i}",
                capacity=random.choice([40, 50, 60]),
                bus_type=random.choice(bus_types),
                is_active=True
            )
            db.add(bus)
            db.commit()
            db.refresh(bus)
            buses.append(bus)
            
            # Create live location for each bus
            location = LiveBusLocation(
                bus_id=bus.id,
                latitude=28.6139 + random.uniform(-0.1, 0.1),
                longitude=77.2090 + random.uniform(-0.1, 0.1),
                speed=random.uniform(20, 60),
                heading=random.uniform(0, 360)
            )
            db.add(location)
        
        # Create routes
        routes_data = [
            ("R1", "Connaught Place - Dwarka", "Connaught Place", "Dwarka Sector 21", 25.5, 60, 50),
            ("R2", "ISBT - Nehru Place", "ISBT Kashmere Gate", "Nehru Place", 18.2, 45, 40),
            ("R3", "Rajiv Chowk - Noida", "Rajiv Chowk", "Noida Sector 18", 22.8, 55, 45),
            ("R4", "Karol Bagh - Gurgaon", "Karol Bagh", "Gurgaon Cyber City", 28.5, 70, 60),
            ("R5", "Rohini - Saket", "Rohini Sector 3", "Saket", 30.2, 75, 55),
        ]
        
        routes = []
        for i, (num, name, start, end, dist, duration, fare) in enumerate(routes_data):
            route = Route(
                route_number=num,
                route_name=name,
                bus_id=buses[i].id if i < len(buses) else None,
                start_location=start,
                end_location=end,
                distance_km=dist,
                estimated_duration_minutes=duration,
                fare=fare,
                is_active=True
            )
            db.add(route)
            db.commit()
            db.refresh(route)
            routes.append(route)
            
            # Create stops for each route
            stop_names = [
                f"{start}",
                f"Stop 1 - {name}",
                f"Stop 2 - {name}",
                f"Stop 3 - {name}",
                f"{end}"
            ]
            
            for j, stop_name in enumerate(stop_names):
                stop = Stop(
                    route_id=route.id,
                    stop_name=stop_name,
                    stop_order=j + 1,
                    latitude=28.6139 + random.uniform(-0.05, 0.05),
                    longitude=77.2090 + random.uniform(-0.05, 0.05),
                    estimated_arrival_time=f"{8 + j}:00 AM"
                )
                db.add(stop)
        
        # Create bookings
        passenger_categories = ["general", "student", "senior", "disabled"]
        for i in range(20):
            user = random.choice(users)
            route = random.choice(routes)
            
            booking = Booking(
                user_id=user.id,
                route_id=route.id,
                booking_reference=f"BK{random.randint(10000000, 99999999)}",
                passenger_name=user.full_name,
                passenger_category=random.choice(passenger_categories),
                seat_number=f"{random.randint(1, 50)}",
                journey_date=datetime.now() + timedelta(days=random.randint(0, 30)),
                fare_amount=route.fare,
                status=random.choice([BookingStatus.CONFIRMED, BookingStatus.COMPLETED])
            )
            db.add(booking)
            db.commit()
            db.refresh(booking)
            
            # Create payment for booking
            payment = Payment(
                booking_id=booking.id,
                payment_method=random.choice(["card", "upi", "wallet", "cash"]),
                transaction_id=f"TXN{random.randint(100000000000, 999999999999)}",
                amount=booking.fare_amount,
                status=PaymentStatus.SUCCESS
            )
            db.add(payment)
        
        db.commit()
        print("Database seeded successfully!")
        print("\nAdmin Credentials:")
        print("Email: admin@smartdtc.com")
        print("Password: admin123")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
