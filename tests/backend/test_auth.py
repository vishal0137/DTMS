"""
Authentication Tests
Tests for user registration and login endpoints
"""
import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../backend'))

from main import app

client = TestClient(app)

def test_register_user():
    """Test user registration"""
    response = client.post(
        "/api/auth/register",
        json={
            "email": "newuser@test.com",
            "full_name": "New User",
            "phone": "9876543210",
            "password": "testpass123",
            "role": "passenger"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@test.com"
    assert data["full_name"] == "New User"
    assert "id" in data

def test_register_duplicate_email():
    """Test registration with duplicate email"""
    # First registration
    client.post(
        "/api/auth/register",
        json={
            "email": "duplicate@test.com",
            "full_name": "User One",
            "password": "testpass123",
            "role": "passenger"
        }
    )
    
    # Duplicate registration
    response = client.post(
        "/api/auth/register",
        json={
            "email": "duplicate@test.com",
            "full_name": "User Two",
            "password": "testpass456",
            "role": "passenger"
        }
    )
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()

def test_login_success():
    """Test successful login"""
    response = client.post(
        "/api/auth/login",
        json={
            "email": "admin@smartdtc.com",
            "password": "admin123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials():
    """Test login with wrong password"""
    response = client.post(
        "/api/auth/login",
        json={
            "email": "admin@smartdtc.com",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401
    assert "incorrect" in response.json()["detail"].lower()

def test_login_nonexistent_user():
    """Test login with non-existent email"""
    response = client.post(
        "/api/auth/login",
        json={
            "email": "nonexistent@test.com",
            "password": "anypassword"
        }
    )
    assert response.status_code == 401

def test_protected_endpoint_without_token():
    """Test accessing protected endpoint without token"""
    response = client.get("/api/users/me")
    assert response.status_code == 401

def test_protected_endpoint_with_invalid_token():
    """Test accessing protected endpoint with invalid token"""
    response = client.get(
        "/api/users/me",
        headers={"Authorization": "Bearer invalid_token_here"}
    )
    assert response.status_code == 401

def test_get_current_user():
    """Test getting current user info"""
    # Login first
    login_response = client.post(
        "/api/auth/login",
        json={"email": "admin@smartdtc.com", "password": "admin123"}
    )
    token = login_response.json()["access_token"]
    
    # Get current user
    response = client.get(
        "/api/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "admin@smartdtc.com"
    assert "id" in data
