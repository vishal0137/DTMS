from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from database import get_db
from models import Bus, Booking, Payment, PaymentStatus, BookingStatus
from schemas import KPIResponse, RouteRevenueResponse, PassengerCategoryResponse
from auth_utils import get_current_active_user

router = APIRouter()

@router.get("/kpis", response_model=KPIResponse)
def get_kpis(db: Session = Depends(get_db)):
    # Active buses
    active_buses = db.query(Bus).filter(Bus.is_active == True).count()
    
    # Total revenue
    total_revenue = db.query(func.sum(Payment.amount)).filter(
        Payment.status == PaymentStatus.SUCCESS
    ).scalar() or 0.0
    
    # Passenger count
    passenger_count = db.query(Booking).filter(
        Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.COMPLETED])
    ).count()
    
    # On-time performance (mock calculation)
    on_time_performance = 87.5
    
    return {
        "active_buses": active_buses,
        "total_revenue": total_revenue,
        "passenger_count": passenger_count,
        "on_time_performance": on_time_performance
    }

@router.get("/route-revenue", response_model=List[RouteRevenueResponse])
def get_route_revenue(db: Session = Depends(get_db)):
    from models import Route
    
    results = db.query(
        Route.route_name,
        func.sum(Payment.amount).label("revenue")
    ).join(
        Booking, Booking.route_id == Route.id
    ).join(
        Payment, Payment.booking_id == Booking.id
    ).filter(
        Payment.status == PaymentStatus.SUCCESS
    ).group_by(Route.route_name).all()
    
    return [{"route_name": r[0], "revenue": r[1] or 0.0} for r in results]

@router.get("/passenger-categories", response_model=List[PassengerCategoryResponse])
def get_passenger_categories(db: Session = Depends(get_db)):
    results = db.query(
        Booking.passenger_category,
        func.count(Booking.id).label("count")
    ).filter(
        Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.COMPLETED])
    ).group_by(Booking.passenger_category).all()
    
    return [{"category": r[0], "count": r[1]} for r in results]
