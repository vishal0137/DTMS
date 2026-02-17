from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Bus, User, LiveBusLocation
from schemas import BusCreate, BusUpdate, BusResponse
from auth_utils import get_current_active_user

router = APIRouter()

@router.post("/", response_model=BusResponse, status_code=status.HTTP_201_CREATED)
def create_bus(
    bus: BusCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_bus = Bus(**bus.dict())
    db.add(db_bus)
    db.commit()
    db.refresh(db_bus)
    return db_bus

@router.get("/", response_model=List[BusResponse])
def get_buses(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    buses = db.query(Bus).offset(skip).limit(limit).all()
    return buses

@router.get("/live-locations", response_model=List[dict])
def get_live_bus_locations(db: Session = Depends(get_db)):
    """Get all buses with their live GPS locations"""
    locations = db.query(
        Bus.id,
        Bus.bus_number,
        Bus.registration_number,
        Bus.bus_type,
        Bus.is_active,
        LiveBusLocation.latitude,
        LiveBusLocation.longitude,
        LiveBusLocation.speed,
        LiveBusLocation.heading,
        LiveBusLocation.last_updated
    ).join(
        LiveBusLocation, Bus.id == LiveBusLocation.bus_id
    ).filter(
        Bus.is_active == True
    ).all()
    
    return [
        {
            "id": loc.id,
            "bus_number": loc.bus_number,
            "registration_number": loc.registration_number,
            "bus_type": loc.bus_type,
            "is_active": loc.is_active,
            "latitude": loc.latitude,
            "longitude": loc.longitude,
            "speed": loc.speed,
            "heading": loc.heading,
            "last_updated": loc.last_updated
        }
        for loc in locations
    ]

@router.get("/{bus_id}", response_model=BusResponse)
def get_bus(bus_id: int, db: Session = Depends(get_db)):
    bus = db.query(Bus).filter(Bus.id == bus_id).first()
    if not bus:
        raise HTTPException(status_code=404, detail="Bus not found")
    return bus

@router.put("/{bus_id}", response_model=BusResponse)
def update_bus(
    bus_id: int,
    bus_update: BusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    bus = db.query(Bus).filter(Bus.id == bus_id).first()
    if not bus:
        raise HTTPException(status_code=404, detail="Bus not found")
    
    for key, value in bus_update.dict(exclude_unset=True).items():
        setattr(bus, key, value)
    
    db.commit()
    db.refresh(bus)
    return bus

@router.delete("/{bus_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bus(
    bus_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    bus = db.query(Bus).filter(Bus.id == bus_id).first()
    if not bus:
        raise HTTPException(status_code=404, detail="Bus not found")
    
    db.delete(bus)
    db.commit()
    return None
