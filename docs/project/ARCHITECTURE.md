# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Browser    │  │  Mobile App  │  │  Third Party │         │
│  │  (React UI)  │  │   (Future)   │  │     APIs     │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                  │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          │ HTTPS/WSS        │ HTTPS/WSS        │ HTTPS
          │                  │                  │
┌─────────┼──────────────────┼──────────────────┼─────────────────┐
│         │         API GATEWAY / LOAD BALANCER │                  │
│         └──────────────────┴──────────────────┘                  │
│                              │                                    │
│                    ┌─────────┴─────────┐                        │
│                    │                   │                        │
│         ┌──────────▼──────────┐ ┌─────▼──────────┐            │
│         │   FastAPI Server 1  │ │ FastAPI Server 2│            │
│         │  (Backend Instance) │ │ (Backend Instance)│          │
│         └──────────┬──────────┘ └─────┬──────────┘            │
│                    │                   │                        │
│                    └─────────┬─────────┘                        │
└──────────────────────────────┼──────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────┐
│                    DATABASE LAYER                                │
│                               │                                  │
│         ┌────────────────────▼────────────────────┐            │
│         │      PostgreSQL Primary Database        │            │
│         │  (Users, Buses, Routes, Bookings, etc.) │            │
│         └────────────────────┬────────────────────┘            │
│                              │                                  │
│         ┌────────────────────▼────────────────────┐            │
│         │    PostgreSQL Read Replica (Optional)   │            │
│         │         (For Analytics Queries)         │            │
│         └─────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                    Presentation Layer                   │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │   │
│  │  │Dashboard │ │  Login   │ │  Buses   │ │  Routes  │ │   │
│  │  │   Page   │ │   Page   │ │   Page   │ │   Page   │ │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │   │
│  └────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                    Component Layer                      │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │   │
│  │  │ Sidebar  │ │  TopNav  │ │ KPICard  │ │ LiveMap  │ │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │   │
│  └────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                     Service Layer                       │   │
│  │  ┌──────────────────────────────────────────────────┐ │   │
│  │  │         Axios Client (HTTP/WebSocket)            │ │   │
│  │  │  - JWT Token Management                          │ │   │
│  │  │  - Request/Response Interceptors                 │ │   │
│  │  │  - Error Handling                                │ │   │
│  │  └──────────────────────────────────────────────────┘ │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ HTTP/WebSocket
                               │
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (FastAPI)                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                      API Layer                          │   │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐    │   │
│  │  │ Auth │ │Buses │ │Routes│ │Stops │ │Bookings│    │   │
│  │  │Router│ │Router│ │Router│ │Router│ │ Router │    │   │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────────┘    │   │
│  │  ┌──────┐ ┌──────┐ ┌──────────┐ ┌──────────────┐    │   │
│  │  │Users │ │Paymt │ │Analytics│ │  WebSocket   │    │   │
│  │  │Router│ │Router│ │  Router │ │    Router    │    │   │
│  │  └──────┘ └──────┘ └──────────┘ └──────────────┘    │   │
│  └────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                   Business Logic Layer                  │   │
│  │  ┌──────────────────────────────────────────────────┐ │   │
│  │  │              Pydantic Schemas                    │ │   │
│  │  │  - Request Validation                            │ │   │
│  │  │  - Response Serialization                        │ │   │
│  │  │  - Type Safety                                   │ │   │
│  │  └──────────────────────────────────────────────────┘ │   │
│  │  ┌──────────────────────────────────────────────────┐ │   │
│  │  │           Authentication & Authorization         │ │   │
│  │  │  - JWT Token Generation/Validation               │ │   │
│  │  │  - Password Hashing                              │ │   │
│  │  │  - Role-Based Access Control                     │ │   │
│  │  └──────────────────────────────────────────────────┘ │   │
│  └────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                    Data Access Layer                    │   │
│  │  ┌──────────────────────────────────────────────────┐ │   │
│  │  │              SQLAlchemy ORM                      │ │   │
│  │  │  - Model Definitions                             │ │   │
│  │  │  - Relationships                                 │ │   │
│  │  │  - Query Building                                │ │   │
│  │  └──────────────────────────────────────────────────┘ │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                         │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  users   │  │  wallets │  │metro_cards│ │transactions│     │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
│       │             │              │             │             │
│  ┌────┴─────┐  ┌───┴──────┐  ┌───┴──────┐  ┌───┴──────┐     │
│  │  buses   │  │  routes  │  │  stops   │  │ bookings │     │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘     │
│       │             │              │             │             │
│  ┌────┴─────────────┴──────────────┴─────────────┴──────┐    │
│  │              Foreign Key Relationships                │    │
│  │  - User → Wallet (1:1)                               │    │
│  │  - User → Bookings (1:N)                             │    │
│  │  - Bus → Routes (1:N)                                │    │
│  │  - Route → Stops (1:N)                               │    │
│  │  - Booking → Payment (1:1)                           │    │
│  └──────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### Authentication Flow

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│  Client  │                │  Backend │                │ Database │
└────┬─────┘                └────┬─────┘                └────┬─────┘
     │                           │                           │
     │  POST /api/auth/login     │                           │
     │  {email, password}        │                           │
     ├──────────────────────────>│                           │
     │                           │                           │
     │                           │  Query user by email      │
     │                           ├──────────────────────────>│
     │                           │                           │
     │                           │  Return user data         │
     │                           │<──────────────────────────┤
     │                           │                           │
     │                           │  Verify password          │
     │                           │  (bcrypt)                 │
     │                           │                           │
     │                           │  Generate JWT token       │
     │                           │                           │
     │  Return token             │                           │
     │<──────────────────────────┤                           │
     │                           │                           │
     │  Store token in           │                           │
     │  localStorage             │                           │
     │                           │                           │
```

### Booking Flow

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│  Client  │                │  Backend │                │ Database │
└────┬─────┘                └────┬─────┘                └────┬─────┘
     │                           │                           │
     │  POST /api/bookings/      │                           │
     │  + JWT Token              │                           │
     ├──────────────────────────>│                           │
     │                           │                           │
     │                           │  Validate JWT token       │
     │                           │                           │
     │                           │  Get route details        │
     │                           ├──────────────────────────>│
     │                           │<──────────────────────────┤
     │                           │                           │
     │                           │  Generate booking ref     │
     │                           │                           │
     │                           │  Create booking record    │
     │                           ├──────────────────────────>│
     │                           │<──────────────────────────┤
     │                           │                           │
     │  Return booking details   │                           │
     │<──────────────────────────┤                           │
     │                           │                           │
     │  POST /api/payments/      │                           │
     │  {booking_id, method}     │                           │
     ├──────────────────────────>│                           │
     │                           │                           │
     │                           │  Generate transaction ID  │
     │                           │                           │
     │                           │  Create payment record    │
     │                           ├──────────────────────────>│
     │                           │                           │
     │                           │  Update booking status    │
     │                           ├──────────────────────────>│
     │                           │<──────────────────────────┤
     │                           │                           │
     │  Return payment details   │                           │
     │<──────────────────────────┤                           │
     │                           │                           │
```

### Real-Time Tracking Flow

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│  Client  │                │  Backend │                │ Database │
└────┬─────┘                └────┬─────┘                └────┬─────┘
     │                           │                           │
     │  WebSocket Connect        │                           │
     │  ws://api/ws/live-tracking│                           │
     ├──────────────────────────>│                           │
     │                           │                           │
     │  Connection Established   │                           │
     │<──────────────────────────┤                           │
     │                           │                           │
     │                           │  Query live locations     │
     │                           ├──────────────────────────>│
     │                           │<──────────────────────────┤
     │                           │                           │
     │  Broadcast locations      │                           │
     │<──────────────────────────┤                           │
     │                           │                           │
     │  Update map markers       │                           │
     │                           │                           │
     │                           │  Location update event    │
     │                           │<──────────────────────────┤
     │                           │                           │
     │  Broadcast new location   │                           │
     │<──────────────────────────┤                           │
     │                           │                           │
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Security Layers                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │              Transport Layer Security                   │   │
│  │  - HTTPS/TLS Encryption                                │   │
│  │  - WSS (WebSocket Secure)                              │   │
│  │  - Certificate Management                              │   │
│  └────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │            Application Layer Security                   │   │
│  │  - CORS Configuration                                  │   │
│  │  - Rate Limiting                                       │   │
│  │  - Input Validation (Pydantic)                         │   │
│  │  - XSS Protection                                      │   │
│  └────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │          Authentication & Authorization                 │   │
│  │  - JWT Token (HS256)                                   │   │
│  │  - Token Expiration (30 min)                           │   │
│  │  - Role-Based Access Control                           │   │
│  │  - Password Hashing (bcrypt)                           │   │
│  └────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │               Data Layer Security                       │   │
│  │  - SQL Injection Prevention (ORM)                      │   │
│  │  - Parameterized Queries                               │   │
│  │  - Database Access Control                             │   │
│  │  - Encrypted Connections                               │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Production Setup                         │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                    CDN (CloudFlare)                     │   │
│  │              Static Assets & Caching                    │   │
│  └────────────────────────┬───────────────────────────────┘   │
│                           │                                     │
│  ┌────────────────────────┴───────────────────────────────┐   │
│  │              Load Balancer (Nginx/HAProxy)             │   │
│  │           SSL Termination & Request Routing            │   │
│  └────────────────────────┬───────────────────────────────┘   │
│                           │                                     │
│         ┌─────────────────┼─────────────────┐                 │
│         │                 │                 │                 │
│  ┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐        │
│  │  Backend 1  │   │  Backend 2  │   │  Backend 3  │        │
│  │  (FastAPI)  │   │  (FastAPI)  │   │  (FastAPI)  │        │
│  └──────┬──────┘   └──────┬──────┘   └──────┬──────┘        │
│         │                 │                 │                 │
│         └─────────────────┼─────────────────┘                 │
│                           │                                     │
│  ┌────────────────────────┴───────────────────────────────┐   │
│  │           PostgreSQL Primary (Master)                   │   │
│  │              Write Operations                           │   │
│  └────────────────────────┬───────────────────────────────┘   │
│                           │                                     │
│                           │ Replication                         │
│                           │                                     │
│  ┌────────────────────────┴───────────────────────────────┐   │
│  │         PostgreSQL Replica (Read-Only)                  │   │
│  │            Analytics & Reporting                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  Redis Cache (Optional)                  │   │
│  │           Session Storage & API Caching                 │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Scalability Considerations

### Horizontal Scaling

| Component | Strategy | Benefit |
|-----------|----------|---------|
| Backend Instances | Load balancer | Distributed load |
| Authentication | Stateless JWT | No session storage |
| Database | Read replicas | Query distribution |
| Static Assets | CDN | Fast delivery |

### Vertical Scaling

| Resource | Optimization | Impact |
|----------|-------------|--------|
| Server Resources | CPU, RAM increase | Higher capacity |
| Database Queries | Optimization | Faster response |
| Connection Pooling | SQLAlchemy | Resource efficiency |
| Caching Layer | Redis | Reduced load |

### Database Optimization

| Technique | Implementation | Benefit |
|-----------|---------------|---------|
| Indexing | Foreign keys, search fields | Fast queries |
| Query Optimization | Efficient SQL | Performance |
| Connection Pooling | SQLAlchemy | Resource management |
| Read Replicas | PostgreSQL replication | Load distribution |

### Caching Strategy

| Layer | Technology | Purpose |
|-------|-----------|---------|
| API Response | Redis | Fast retrieval |
| Static Assets | CDN | Global delivery |
| Database Query | Redis | Reduced DB load |
| Session | Redis | Fast access |
