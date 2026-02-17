# Quick Start Guide - Smart DTC

## 🚀 Start the System

### 1. Start Backend (if not running)
```bash
cd web/backend
venv\Scripts\activate
uvicorn main:app --reload
```
**Backend will run on**: http://localhost:8000

### 2. Start Frontend (if not running)
```bash
cd web/frontend
npm run dev
```
**Frontend will run on**: http://localhost:5173

### 3. Start Mobile App (optional)
```bash
cd mobile
npm start
```
**Mobile app**: Scan QR code with Expo Go

## 📱 Access the Application

### Main Pages
1. **Dashboard**: http://localhost:5173/dashboard
   - KPIs, charts, live bus tracking

2. **Bus Routes**: http://localhost:5173/bus-routes
   - Select bus → view routes → see stops

3. **Routes**: http://localhost:5173/routes
   - Browse all 80 routes

4. **Stops**: http://localhost:5173/stops
   - Search and filter 800+ stops

5. **Bookings**: http://localhost:5173/bookings
   - Manage bookings

6. **Analytics**: http://localhost:5173/analytics
   - Comprehensive insights

7. **Users**: http://localhost:5173/users
   - User management

### API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🎯 Quick Demo

### 1-Minute Demo Flow:
1. Open Dashboard → See KPIs and live map
2. Click "Bus Routes" → Select DTC-100 → Click R1 route
3. See beautiful metro-style stops visualization
4. Click "Bookings" → See all bookings with search
5. Click "Analytics" → See comprehensive charts

## 🔧 Troubleshooting

### Backend not starting?
```bash
cd web/backend
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend not starting?
```bash
cd web/frontend
npm install
npm run dev
```

### Mobile app not connecting?
```bash
cd mobile
# Update .env with correct API_URL
# For Android emulator: http://10.0.2.2:8000
# For iOS simulator: http://localhost:8000
npm start
```

### Database connection error?
Check `web/backend/.env`:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/dtms_db
```

### CORS error?
Check `web/backend/.env`:
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

## 📊 Current Data

- **Buses**: 10 (DTC-100 to DTC-109)
- **Routes**: 80 routes
- **Stops**: 800 stops
- **Users**: 6 users (1 admin + 5 passengers)

## 🎨 Features Highlights

### Metro-Style Visualizations
- Colorful route lines (10 colors)
- Vertical stop layout
- START/END badges
- Connected stops with lines

### Live Tracking
- 10 buses with real GPS
- Auto-refresh every 10 seconds
- Interactive map markers

### Analytics
- 4 KPI cards
- 4 interactive charts
- Route performance table
- Trend indicators

### Search & Filter
- Search bookings by name/reference
- Filter by status
- Search stops by name
- Filter stops by route

## ✅ Verification

### Check if everything is working:
```bash
# Test backend
curl http://localhost:8000/health

# Test buses API
curl http://localhost:8000/api/buses

# Test live locations
curl http://localhost:8000/api/buses/live-locations
```

### Expected Results:
- Backend: `{"status":"healthy"}`
- Buses: Array of 10 buses
- Live Locations: Array of 10 buses with GPS

## 🎓 User Credentials

### Admin Login (if needed):
- **Email**: admin@smartdtc.com
- **Password**: admin123

### Development Mode:
- Auto-authenticated (no login required)
- Token set automatically

## 📖 Documentation

- **Main Docs**: `docs/INDEX.md`
- **Database**: `docs/database/README.md`
- **API**: `docs/api/API_DOCUMENTATION.md`
- **Complete Summary**: `COMPLETE_PROJECT_SUMMARY.md`

## 🎉 You're Ready!

Everything is set up and working. Enjoy exploring the Smart DTC Transit Management System!

---

**Need Help?**
- Check console (F12) for errors
- Review `COMPLETE_PROJECT_SUMMARY.md`
- Check `docs/INDEX.md` for detailed docs

**Status**: ✅ All Systems Operational
