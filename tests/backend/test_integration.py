"""
Integration Tests
Tests for complete workflows across multiple endpoints
"""
import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../backend'))

from main import app

client = TestClient(app)

def test_complete_booking_flow():
    """Test complete booking and payment flow"""
    # 1. Login
    login_response = client.post(
        "/api/auth/login",
        json={"email": "admin@smartdtc.com", "password": "admin123"}
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Get available routes
    routes_response = client.get("/api/routes/")
    assert routes_response.status_code == 200
    routes = routes_response.json()
    assert len(routes) > 0
    route_id = routes[0]["id"]
    
    # 3. Create booking
    booking_response = client.post(
        "/api/bookings/",
        headers=headers,
        json={
            "route_id": route_id,
            "passenger_name": "Integration Test User",
            "passenger_category": "general",
            "seat_number": "A1",
            "journey_date": "2024-12-31T10:00:00Z"
        }
    )
    assert booking_response.status_code == 201
    booking = booking_response.json()
    booking_id = booking["id"]
    assert booking["status"] == "pending"
    
    # 4. Create payment
    payment_response = client.post(
        "/api/payments/",
        headers=headers,
        json={
            "booking_id": booking_id,
            "payment_method": "card",
            "amount": booking["fare_amount"]
        }
    )
    assert payment_response.status_code == 201
    payment = payment_response.json()
    assert payment["status"] == "success"
    assert payment["booking_id"] == booking_id
    
    # 5. Verify booking is confirmed
    booking_check = client.get(f"/api/bookings/{booking_id}", headers=headers)
    assert booking_check.status_code == 200
    updated_booking = booking_check.json()
    assert updated_booking["status"] == "confirmed"

def test_analytics_data_flow():
    """Test analytics endpoints return consistent data"""
    # Get KPIs
    kpi_response = client.get("/api/analytics/kpis")
    assert kpi_response.status_code == 200
    kpis = kpi_response.json()
    
    assert "active_buses" in kpis
    assert "total_revenue" in kpis
    assert "passenger_count" in kpis
    assert "on_time_performance" in kpis
    
    # Get route revenue
    revenue_response = client.get("/api/analytics/route-revenue")
    assert revenue_response.status_code == 200
    revenue_data = revenue_response.json()
    assert isinstance(revenue_data, list)
    
    # Get passenger categories
    category_response = client.get("/api/analytics/passenger-categories")
    assert category_response.status_code == 200
    category_data = category_response.json()
    assert isinstance(category_data, list)

def test_route_with_stops_flow():
    """Test creating route with stops"""
    # Login
    login_response = client.post(
        "/api/auth/login",
        json={"email": "admin@smartdtc.com", "password": "admin123"}
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create route
    route_response = client.post(
        "/api/routes/",
        headers=headers,
        json={
            "route_number": "TEST-R1",
            "route_name": "Test Route",
            "start_location": "Start Point",
            "end_location": "End Point",
            "distance_km": 15.5,
            "estimated_duration_minutes": 45,
            "fare": 30
        }
    )
    assert route_response.status_code == 201
    route = route_response.json()
    route_id = route["id"]
    
    # Add stops to route
    stops_data = [
        {"stop_name": "Stop 1", "stop_order": 1, "latitude": 28.6, "longitude": 77.2},
        {"stop_name": "Stop 2", "stop_order": 2, "latitude": 28.61, "longitude": 77.21},
        {"stop_name": "Stop 3", "stop_order": 3, "latitude": 28.62, "longitude": 77.22}
    ]
    
    for stop_data in stops_data:
        stop_data["route_id"] = route_id
        stop_response = client.post(
            "/api/stops/",
            headers=headers,
            json=stop_data
        )
        assert stop_response.status_code == 201
    
    # Get stops for route
    stops_response = client.get(f"/api/stops/route/{route_id}")
    assert stops_response.status_code == 200
    stops = stops_response.json()
    assert len(stops) == 3
    assert stops[0]["stop_order"] == 1
    assert stops[1]["stop_order"] == 2
    assert stops[2]["stop_order"] == 3
