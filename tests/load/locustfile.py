"""
Load Testing with Locust
Run with: locust -f locustfile.py --host=http://localhost:8000
"""
from locust import HttpUser, task, between
import random

class SmartDTCUser(HttpUser):
    """Simulates a user interacting with the Smart DTC API"""
    wait_time = between(1, 3)
    
    def on_start(self):
        """Login when user starts"""
        response = self.client.post("/api/auth/login", json={
            "email": "admin@smartdtc.com",
            "password": "admin123"
        })
        if response.status_code == 200:
            self.token = response.json()["access_token"]
            self.headers = {"Authorization": f"Bearer {self.token}"}
        else:
            self.token = None
            self.headers = {}
    
    @task(5)
    def get_kpis(self):
        """Get KPI metrics (most frequent)"""
        self.client.get("/api/analytics/kpis")
    
    @task(3)
    def get_buses(self):
        """Get all buses"""
        self.client.get("/api/buses/")
    
    @task(3)
    def get_routes(self):
        """Get all routes"""
        self.client.get("/api/routes/")
    
    @task(2)
    def get_route_revenue(self):
        """Get route revenue analytics"""
        self.client.get("/api/analytics/route-revenue")
    
    @task(2)
    def get_passenger_categories(self):
        """Get passenger category distribution"""
        self.client.get("/api/analytics/passenger-categories")
    
    @task(1)
    def get_bookings(self):
        """Get bookings (requires auth)"""
        if self.token:
            self.client.get("/api/bookings/", headers=self.headers)
    
    @task(1)
    def get_user_info(self):
        """Get current user info (requires auth)"""
        if self.token:
            self.client.get("/api/users/me", headers=self.headers)
    
    @task(1)
    def create_booking(self):
        """Create a booking (requires auth)"""
        if self.token:
            # Get a random route first
            routes_response = self.client.get("/api/routes/")
            if routes_response.status_code == 200:
                routes = routes_response.json()
                if routes:
                    route = random.choice(routes)
                    self.client.post(
                        "/api/bookings/",
                        headers=self.headers,
                        json={
                            "route_id": route["id"],
                            "passenger_name": "Load Test User",
                            "passenger_category": random.choice(["general", "student", "senior"]),
                            "seat_number": f"A{random.randint(1, 50)}",
                            "journey_date": "2024-12-31T10:00:00Z"
                        }
                    )

class AdminUser(HttpUser):
    """Simulates an admin user performing management tasks"""
    wait_time = between(2, 5)
    
    def on_start(self):
        """Login as admin"""
        response = self.client.post("/api/auth/login", json={
            "email": "admin@smartdtc.com",
            "password": "admin123"
        })
        if response.status_code == 200:
            self.token = response.json()["access_token"]
            self.headers = {"Authorization": f"Bearer {self.token}"}
    
    @task(2)
    def view_all_users(self):
        """View all users"""
        self.client.get("/api/users/", headers=self.headers)
    
    @task(3)
    def view_all_bookings(self):
        """View all bookings"""
        self.client.get("/api/bookings/", headers=self.headers)
    
    @task(2)
    def view_all_payments(self):
        """View all payments"""
        self.client.get("/api/payments/", headers=self.headers)
    
    @task(1)
    def manage_buses(self):
        """View and update buses"""
        buses_response = self.client.get("/api/buses/")
        if buses_response.status_code == 200:
            buses = buses_response.json()
            if buses:
                bus = random.choice(buses)
                self.client.get(f"/api/buses/{bus['id']}")
