# Tests Directory

This directory contains all test files for the Smart DTC Platform.

## Structure

```
tests/
├── backend/           # Backend API tests
│   ├── test_auth.py
│   ├── test_buses.py
│   ├── test_routes.py
│   ├── test_bookings.py
│   └── test_integration.py
├── frontend/          # Frontend component tests
│   ├── KPICard.test.jsx
│   ├── Dashboard.test.jsx
│   └── Login.test.jsx
├── load/              # Load testing scripts
│   └── locustfile.py
└── README.md          # This file
```

## Running Tests

### Backend Tests

```bash
cd backend
pip install pytest pytest-cov
pytest ../tests/backend/ -v
pytest ../tests/backend/ --cov=. --cov-report=html
```

### Frontend Tests

```bash
cd frontend
npm install -D vitest @testing-library/react
npm test
```

### Load Tests

```bash
pip install locust
locust -f tests/load/locustfile.py --host=http://localhost:8000
```

## Test Coverage Goals

- Backend: 80%+ coverage
- Frontend: 70%+ coverage
- Integration: All critical flows tested

## Writing Tests

See [docs/TESTING.md](../docs/TESTING.md) for detailed testing guide and examples.
