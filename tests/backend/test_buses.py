"""
Bus Management Tests
Tests for bus CRUD operations
"""
import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../backend'))

from main import app

client = TestClient(app)

@pytest.fixture
def auth_token():
    """Get authentication token"""
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@smartdtc.com", "password": "admin123"}
    )
    return response.json()["access_token"]

def test_create_bus(auth_token):
    """Test creating a new bus"""
    response = client.post(
        "/api/buses/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={
            "bus_number": "TEST-001",
            "registration_number": "DL-TEST-001",
            "capacity": 50,
            "bus_type": "AC"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["bus_number"] == "TEST-001"
    assert data["capacity"] == 50
    assert data["is_active"] == True

def test_get_buses():
    """Test getting all buses"""
    response = client.get("/api/buses/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_get_bus_by_id():
    """Test getting a specific bus"""
    # Get all buses first
    buses = client.get("/api/buses/").json()
    if buses:
        bus_id = buses[0]["id"]
        response = client.get(f"/api/buses/{bus_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == bus_id

def test_update_bus(auth_token):
    """Test updating a bus"""
    # Get a bus first
    buses = client.get("/api/buses/").json()
    if buses:
        bus_id = buses[0]["id"]
        response = client.put(
            f"/api/buses/{bus_id}",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "capacity": 60,
                "is_active": False
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["capacity"] == 60
        assert data["is_active"] == False

def test_delete_bus(auth_token):
    """Test deleting a bus"""
    # Create a bus first
    create_response = client.post(
        "/api/buses/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={
            "bus_number": "DELETE-TEST",
            "registration_number": "DL-DEL-001",
            "capacity": 40,
            "bus_type": "Standard"
        }
    )
    bus_id = create_response.json()["id"]
    
    # Delete it
    response = client.delete(
        f"/api/buses/{bus_id}",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 204
    
    # Verify it's deleted
    get_response = client.get(f"/api/buses/{bus_id}")
    assert get_response.status_code == 404

def test_create_bus_without_auth():
    """Test creating bus without authentication"""
    response = client.post(
        "/api/buses/",
        json={
            "bus_number": "NOAUTH-001",
            "registration_number": "DL-NA-001",
            "capacity": 50
        }
    )
    assert response.status_code == 401
