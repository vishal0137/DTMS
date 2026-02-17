# API Documentation

Base URL: `http://localhost:8000`

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "full_name": "John Doe",
  "phone": "9876543210",
  "password": "securepassword",
  "role": "passenger"
}

Response: 201 Created
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "phone": "9876543210",
  "role": "passenger",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@smartdtc.com",
  "password": "admin123"
}

Response: 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

## Users

### Get Current User
```http
GET /api/users/me
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  "email": "admin@smartdtc.com",
  "full_name": "Admin User",
  "phone": "9876543210",
  "role": "admin",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Get All Users
```http
GET /api/users/?skip=0&limit=100
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "email": "user1@example.com",
    "full_name": "User 1",
    ...
  }
]
```

## Buses

### Create Bus
```http
POST /api/buses/
Authorization: Bearer <token>
Content-Type: application/json

{
  "bus_number": "DTC-101",
  "registration_number": "DL-1C-1001",
  "capacity": 50,
  "bus_type": "AC"
}

Response: 201 Created
{
  "id": 1,
  "bus_number": "DTC-101",
  "registration_number": "DL-1C-1001",
  "capacity": 50,
  "bus_type": "AC",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Get All Buses
```http
GET /api/buses/?skip=0&limit=100

Response: 200 OK
[
  {
    "id": 1,
    "bus_number": "DTC-101",
    "registration_number": "DL-1C-1001",
    "capacity": 50,
    "bus_type": "AC",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Update Bus
```http
PUT /api/buses/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "capacity": 60,
  "is_active": false
}

Response: 200 OK
{
  "id": 1,
  "bus_number": "DTC-101",
  "capacity": 60,
  "is_active": false,
  ...
}
```

### Delete Bus
```http
DELETE /api/buses/1
Authorization: Bearer <token>

Response: 204 No Content
```

## Routes

### Create Route
```http
POST /api/routes/
Authorization: Bearer <token>
Content-Type: application/json

{
  "route_number": "R1",
  "route_name": "Connaught Place - Dwarka",
  "bus_id": 1,
  "start_location": "Connaught Place",
  "end_location": "Dwarka Sector 21",
  "distance_km": 25.5,
  "estimated_duration_minutes": 60,
  "fare": 50
}

Response: 201 Created
{
  "id": 1,
  "route_number": "R1",
  "route_name": "Connaught Place - Dwarka",
  "bus_id": 1,
  "start_location": "Connaught Place",
  "end_location": "Dwarka Sector 21",
  "distance_km": 25.5,
  "estimated_duration_minutes": 60,
  "fare": 50,
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Get All Routes
```http
GET /api/routes/?skip=0&limit=100

Response: 200 OK
[
  {
    "id": 1,
    "route_number": "R1",
    "route_name": "Connaught Place - Dwarka",
    ...
  }
]
```

## Stops

### Create Stop
```http
POST /api/stops/
Authorization: Bearer <token>
Content-Type: application/json

{
  "route_id": 1,
  "stop_name": "Rajiv Chowk",
  "stop_order": 1,
  "latitude": 28.6328,
  "longitude": 77.2197,
  "estimated_arrival_time": "08:00 AM"
}

Response: 201 Created
{
  "id": 1,
  "route_id": 1,
  "stop_name": "Rajiv Chowk",
  "stop_order": 1,
  "latitude": 28.6328,
  "longitude": 77.2197,
  "estimated_arrival_time": "08:00 AM",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Get Stops by Route
```http
GET /api/stops/route/1

Response: 200 OK
[
  {
    "id": 1,
    "route_id": 1,
    "stop_name": "Rajiv Chowk",
    "stop_order": 1,
    ...
  }
]
```

## Bookings

### Create Booking
```http
POST /api/bookings/
Authorization: Bearer <token>
Content-Type: application/json

{
  "route_id": 1,
  "passenger_name": "John Doe",
  "passenger_category": "general",
  "seat_number": "A1",
  "journey_date": "2024-01-15T08:00:00Z"
}

Response: 201 Created
{
  "id": 1,
  "user_id": 1,
  "route_id": 1,
  "booking_reference": "BK12345678",
  "passenger_name": "John Doe",
  "passenger_category": "general",
  "seat_number": "A1",
  "journey_date": "2024-01-15T08:00:00Z",
  "fare_amount": 50,
  "status": "pending",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Get My Bookings
```http
GET /api/bookings/my-bookings
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "booking_reference": "BK12345678",
    "passenger_name": "John Doe",
    "status": "confirmed",
    ...
  }
]
```

### Update Booking
```http
PUT /api/bookings/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed",
  "seat_number": "B2"
}

Response: 200 OK
{
  "id": 1,
  "status": "confirmed",
  "seat_number": "B2",
  ...
}
```

## Payments

### Create Payment
```http
POST /api/payments/
Authorization: Bearer <token>
Content-Type: application/json

{
  "booking_id": 1,
  "payment_method": "card",
  "amount": 50
}

Response: 201 Created
{
  "id": 1,
  "booking_id": 1,
  "payment_method": "card",
  "transaction_id": "TXN123456789012",
  "amount": 50,
  "status": "success",
  "payment_date": "2024-01-01T00:00:00Z"
}
```

### Get All Payments
```http
GET /api/payments/?skip=0&limit=100
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "booking_id": 1,
    "transaction_id": "TXN123456789012",
    "amount": 50,
    "status": "success",
    ...
  }
]
```

## Analytics

### Get KPIs
```http
GET /api/analytics/kpis

Response: 200 OK
{
  "active_buses": 10,
  "total_revenue": 125000.50,
  "passenger_count": 2500,
  "on_time_performance": 87.5
}
```

### Get Route Revenue
```http
GET /api/analytics/route-revenue

Response: 200 OK
[
  {
    "route_name": "Connaught Place - Dwarka",
    "revenue": 45000
  },
  {
    "route_name": "ISBT - Nehru Place",
    "revenue": 38000
  }
]
```

### Get Passenger Categories
```http
GET /api/analytics/passenger-categories

Response: 200 OK
[
  {
    "category": "general",
    "count": 450
  },
  {
    "category": "student",
    "count": 280
  },
  {
    "category": "senior",
    "count": 120
  }
]
```

## WebSocket

### Live Bus Tracking
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/live-tracking');

ws.onopen = () => {
  console.log('Connected to live tracking');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Bus location update:', data);
  // { bus_id: 1, latitude: 28.6139, longitude: 77.2090, speed: 45 }
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('Disconnected from live tracking');
};
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding rate limiting middleware.

## Pagination

Most list endpoints support pagination via query parameters:
- `skip`: Number of records to skip (default: 0)
- `limit`: Maximum number of records to return (default: 100)

Example:
```http
GET /api/buses/?skip=20&limit=10
```

## Interactive Documentation

FastAPI provides interactive API documentation:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
