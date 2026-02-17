from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from database import get_db
from models import Payment, Booking, User, BookingStatus, PaymentStatus
from schemas import PaymentCreate, PaymentResponse
from auth_utils import get_current_active_user

router = APIRouter()

@router.post("/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
def create_payment(
    payment: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if booking exists
    booking = db.query(Booking).filter(Booking.id == payment.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Check if payment already exists
    existing_payment = db.query(Payment).filter(Payment.booking_id == payment.booking_id).first()
    if existing_payment:
        raise HTTPException(status_code=400, detail="Payment already exists for this booking")
    
    # Generate transaction ID
    transaction_id = f"TXN{uuid.uuid4().hex[:12].upper()}"
    
    db_payment = Payment(
        booking_id=payment.booking_id,
        payment_method=payment.payment_method,
        transaction_id=transaction_id,
        amount=payment.amount,
        status=PaymentStatus.SUCCESS
    )
    db.add(db_payment)
    
    # Update booking status
    booking.status = BookingStatus.CONFIRMED
    
    db.commit()
    db.refresh(db_payment)
    return db_payment

@router.get("/", response_model=List[PaymentResponse])
def get_payments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    payments = db.query(Payment).offset(skip).limit(limit).all()
    return payments

@router.get("/{payment_id}", response_model=PaymentResponse)
def get_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment
