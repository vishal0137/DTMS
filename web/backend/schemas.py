from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from models import UserRole, BookingStatus, PaymentStatus, TransactionType

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    role: UserRole = UserRole.PASSENGER

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Wallet Schemas
class WalletResponse(BaseModel):
    id: int
    user_id: int
    balance: float
    created_at: datetime

    class Config:
        from_attributes = True

# Transaction Schemas
class TransactionCreate(BaseModel):
    amount: float
    transaction_type: TransactionType
    description: Optional[str] = None

class TransactionResponse(BaseModel):
    id: int
    wallet_id: int
    amount: float
    transaction_type: TransactionType
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Bus Schemas
class BusBase(BaseModel):
    bus_number: str
    registration_number: str
    capacity: int
    bus_type: Optional[str] = None

class BusCreate(BusBase):
    pass

class BusUpdate(BaseModel):
    bus_number: Optional[str] = None
    capacity: Optional[int] = None
    bus_type: Optional[str] = None
    is_active: Optional[bool] = None

class BusResponse(BusBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Route Schemas
class RouteBase(BaseModel):
    route_number: str
    route_name: str
    start_location: str
    end_location: str
    distance_km: Optional[float] = None
    estimated_duration_minutes: Optional[int] = None
    fare: float

class RouteCreate(RouteBase):
    bus_id: Optional[int] = None

class RouteUpdate(BaseModel):
    route_name: Optional[str] = None
    bus_id: Optional[int] = None
    fare: Optional[float] = None
    is_active: Optional[bool] = None

class RouteResponse(RouteBase):
    id: int
    bus_id: Optional[int]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Stop Schemas
class StopBase(BaseModel):
    stop_name: str
    stop_order: int
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    estimated_arrival_time: Optional[str] = None

class StopCreate(StopBase):
    route_id: int

class StopResponse(StopBase):
    id: int
    route_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Booking Schemas
class BookingBase(BaseModel):
    route_id: int
    passenger_name: str
    passenger_category: str = "general"
    seat_number: Optional[str] = None
    journey_date: datetime

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    seat_number: Optional[str] = None

class BookingResponse(BookingBase):
    id: int
    user_id: int
    booking_reference: str
    fare_amount: float
    status: BookingStatus
    created_at: datetime

    class Config:
        from_attributes = True

# Payment Schemas
class PaymentCreate(BaseModel):
    booking_id: int
    payment_method: str
    amount: float

class PaymentResponse(BaseModel):
    id: int
    booking_id: int
    payment_method: str
    transaction_id: Optional[str]
    amount: float
    status: PaymentStatus
    payment_date: datetime

    class Config:
        from_attributes = True

# Live Location Schemas
class LiveLocationUpdate(BaseModel):
    bus_id: int
    latitude: float
    longitude: float
    speed: Optional[float] = 0.0
    heading: Optional[float] = None

class LiveLocationResponse(BaseModel):
    id: int
    bus_id: int
    latitude: float
    longitude: float
    speed: float
    heading: Optional[float]
    last_updated: datetime

    class Config:
        from_attributes = True

# Analytics Schemas
class KPIResponse(BaseModel):
    active_buses: int
    total_revenue: float
    passenger_count: int
    on_time_performance: float

class RouteRevenueResponse(BaseModel):
    route_name: str
    revenue: float

class PassengerCategoryResponse(BaseModel):
    category: str
    count: int
