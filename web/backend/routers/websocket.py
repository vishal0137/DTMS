from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from typing import List
import json

from database import get_db
from models import LiveBusLocation

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                pass

manager = ConnectionManager()

@router.websocket("/live-tracking")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo back or process data
            await manager.broadcast(f"Message: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@router.get("/broadcast-location/{bus_id}")
async def broadcast_bus_location(bus_id: int, db: Session = Depends(get_db)):
    location = db.query(LiveBusLocation).filter(LiveBusLocation.bus_id == bus_id).first()
    if location:
        message = json.dumps({
            "bus_id": location.bus_id,
            "latitude": location.latitude,
            "longitude": location.longitude,
            "speed": location.speed
        })
        await manager.broadcast(message)
        return {"status": "broadcasted"}
    return {"status": "not found"}
