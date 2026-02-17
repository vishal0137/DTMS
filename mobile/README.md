# DTMS Mobile App

React Native mobile application for Delhi Transport Management System.

## Quick Start

### Prerequisites

| Requirement | Version | Purpose |
|------------|---------|---------|
| Node.js | 16+ | Runtime |
| Expo CLI | Latest | Development tool |
| iOS Simulator | Latest | iOS testing (Mac only) |
| Android Emulator | Latest | Android testing |

### Installation

```bash
cd mobile
npm install
```

### Configuration

API URL configuration by platform:

| Platform | API URL | Example |
|----------|---------|---------|
| Android Emulator | http://10.0.2.2:8000 | Emulator localhost |
| iOS Simulator | http://localhost:8000 | Simulator localhost |
| Physical Device | http://YOUR_COMPUTER_IP:8000 | Network IP |

Update `.env` file:
```bash
cp .env.example .env
# Edit .env with appropriate API_URL
```

### Running the App

| Command | Platform | Description |
|---------|----------|-------------|
| `npm start` | All | Start Expo dev server |
| `npm run android` | Android | Run on Android |
| `npm run ios` | iOS | Run on iOS (Mac only) |
| `npm run web` | Web | Run in browser |

## Features

### Passenger Features

| Feature | Status | Description |
|---------|--------|-------------|
| Authentication | Complete | Login/Logout functionality |
| Live Tracking | Complete | Real-time bus locations |
| Route Browsing | Complete | 80+ routes available |
| Route Details | Complete | Stops and schedules |
| Booking History | Complete | Past bookings |
| Digital Wallet | Complete | Balance management |
| Profile Management | Complete | User settings |

### Screens

| Screen | Purpose |
|--------|---------|
| Home | Dashboard with live tracking and stats |
| Routes | Browse and search all routes |
| Route Detail | View route map and stops |
| Bookings | View booking history |
| Profile | User profile and settings |

## Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Framework | React Native (Expo) | Cross-platform development |
| Navigation | React Navigation | Screen routing |
| UI Library | React Native Paper | UI components |
| Maps | React Native Maps | Location visualization |
| State Management | Context API | Global state |
| HTTP Client | Axios | API communication |
| Storage | AsyncStorage | Local data persistence |

## 📦 Project Structure

```
mobile/
├── src/
│   ├── api/
│   │   └── axios.js           # API client
│   ├── context/
│   │   └── AuthContext.js     # Authentication context
│   ├── navigation/
│   │   └── AppNavigator.js    # Navigation setup
│   └── screens/
│       ├── LoginScreen.js     # Login screen
│       ├── HomeScreen.js      # Dashboard
│       ├── RoutesScreen.js    # Routes list
│       ├── RouteDetailScreen.js
│       ├── BookingsScreen.js
│       ├── BookingDetailScreen.js
│       └── ProfileScreen.js
├── App.js                      # Root component
├── app.json                    # Expo configuration
├── package.json
└── README.md
```

## Authentication

Default credentials:

| Field | Value |
|-------|-------|
| Email | admin@smartdtc.com |
| Password | admin123 |

## Maps Setup

### Android

Add Google Maps API key to `app.json`:
```json
{
  "android": {
    "config": {
      "googleMaps": {
        "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
      }
    }
  }
}
```

### iOS

No additional setup required for development.

## Testing on Physical Device

| Step | Action |
|------|--------|
| 1 | Install Expo Go app on device |
| 2 | Ensure device and computer on same network |
| 3 | Update API URL in `.env` to computer's IP |
| 4 | Scan QR code from Expo Dev Tools |

## Building for Production

| Platform | Command | Output |
|----------|---------|--------|
| Android | `expo build:android` | APK file |
| iOS | `expo build:ios` | IPA file |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Cannot connect to API | Check API URL in `.env`, ensure backend is running |
| Android emulator connection | Use `10.0.2.2` instead of `localhost` |
| Physical device connection | Use computer's IP address |
| Maps not showing | Check internet connection, verify API key (Android) |
| Location permissions | Enable location permissions in device settings |
| Build errors | Clear cache: `expo start -c`, reinstall: `rm -rf node_modules && npm install` |

## API Integration

Backend API base URL: `http://localhost:8000`

### Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/auth/login | POST | User authentication |
| /api/buses | GET | Get all buses |
| /api/routes | GET | Get all routes |
| /api/routes/{id} | GET | Get route details |
| /api/stops | GET | Get stops |
| /api/bookings | GET | Get user bookings |

## Customization

### Theme Colors

Edit colors in individual screen styles or create a theme file.

### App Assets

| Asset | Size | Purpose |
|-------|------|---------|
| icon.png | 1024x1024 | App icon |
| splash.png | 1242x2436 | Splash screen |
| adaptive-icon.png | 1024x1024 | Android adaptive icon |

Replace files in `assets/` folder.

## Notes

| Note | Details |
|------|---------|
| Workflow | Expo managed workflow |
| Backend Dependency | Requires backend API running |
| Permissions | Location permissions needed for maps |
| Orientation | Optimized for portrait |

## Related Documentation

| Document | Path |
|----------|------|
| Backend API | ../web/backend/README.md |
| Web Dashboard | ../web/frontend/README.md |
| Main Documentation | ../README.md |
