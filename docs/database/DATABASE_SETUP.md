# Database Setup - DTMS

## ✅ Database Name: DTMS

The system is configured to use the existing `DTMS` database.

## 📝 Current Configuration

**Database Name**: `DTMS`
**Connection String**: `postgresql://postgres:password@localhost:5432/DTMS`

## 🔧 Update Your Password

Edit `backend/.env` and replace `password` with your actual PostgreSQL password:

```env
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/DTMS
```

## 🚀 Seed the Database

Once you've updated the password, run:

```bash
cd backend
venv\Scripts\activate
python seed_data.py
```

This will create all necessary tables in the DTMS database:
- users
- wallets
- metro_cards
- transactions
- buses
- routes
- stops
- bookings
- payments
- live_bus_locations

## 📊 Sample Data

The seed script will add:
- ✅ 1 Admin user (admin@smartdtc.com / admin123)
- ✅ 5 Passenger users
- ✅ 10 Buses with live GPS locations
- ✅ 5 Routes with multiple stops
- ✅ 20 Bookings with payments
- ✅ Wallet balances
- ✅ Transaction history

## 🔄 Restart Backend

After seeding, restart the backend server:

In the backend PowerShell window:
1. Press `Ctrl + C` to stop
2. Run: `uvicorn main:app --reload`

## ✅ Verify Connection

Once backend starts, check:
- http://localhost:8000/health - Should return `{"status": "healthy"}`
- http://localhost:8000/docs - Should show API documentation

## 🎯 Next Steps

1. ✅ Update password in `backend/.env`
2. ✅ Run `python seed_data.py`
3. ✅ Restart backend server
4. ✅ Open http://localhost:5173
5. ✅ Login with admin@smartdtc.com / admin123

---

**Database**: DTMS
**Status**: Ready to seed and use! 🚀
