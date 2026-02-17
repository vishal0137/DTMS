from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Stop, User
from schemas import StopCreate, StopResponse
from auth_utils import get_current_active_user

router = APIRouter()

@router.post("/", response_model=StopResponse, status_code=status.HTTP_201_CREATED)
def create_stop(
    stop: StopCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_stop = Stop(**stop.dict())
    db.add(db_stop)
    db.commit()
    db.refresh(db_stop)
    return db_stop

@router.get("/", response_model=List[StopResponse])
def get_stops(
    route_id: int = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Stop)
    
    if route_id is not None:
        query = query.filter(Stop.route_id == route_id)
    
    stops = query.order_by(Stop.stop_order).offset(skip).limit(limit).all()
    return stops

@router.get("/route/{route_id}", response_model=List[StopResponse])
def get_stops_by_route(route_id: int, db: Session = Depends(get_db)):
    stops = db.query(Stop).filter(Stop.route_id == route_id).order_by(Stop.stop_order).all()
    return stops

@router.get("/{stop_id}", response_model=StopResponse)
def get_stop(stop_id: int, db: Session = Depends(get_db)):
    stop = db.query(Stop).filter(Stop.id == stop_id).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
    return stop

@router.delete("/{stop_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_stop(
    stop_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    stop = db.query(Stop).filter(Stop.id == stop_id).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
    
    db.delete(stop)
    db.commit()
    return None
