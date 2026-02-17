# DTMS Mobile App

React Native mobile application for Delhi Transport Management System.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
cd mobile
npm install
```

### Configuration

1. Copy environment file:
```bash
cp .env.example .env
```

2. Update API URL in `.env`:
- **Android Emulator**: `http://10.0.2.2:8000`
- **iOS Simulator**: `http://localhost:8000`
- **Physical Device**: `http://YOUR_COMPUTER_IP:8000`

### Running the App

```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## 📱 Features

### Passenger Features
- ✅ User authentication (Login/Logout)
- ✅ Live bus tracking on map
- ✅ Browse 80+ routes
- ✅ View route details with stops
- ✅ View booking history
- ✅ Digital wallet balance
- ✅ User profile management

### Screens
1. **Home** - Dashboard with live bus tracking and stats
2. **Routes** - Browse and search all routes
3. **Route Detail** - View route map and stops
4. **Bookings** - View booking history
5. **Profile** - User profile and settings

## 🛠️ Tech Stack

- **Framework**: React Native (Expo)
- **Navigation**: React Navigation
- **UI Library**: React Native Paper
- **Maps**: React Native Maps
- **State Management**: Context API
- **HTTP Client**: Axios
- **Storage**: AsyncStorage

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

## 🔐 Authentication

Default credentials:
- **Email**: `admin@smartdtc.com`
- **Password**: `admin123`

## 🗺️ Maps Setup

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

## 📱 Testing on Physical Device

1. Install Expo Go app on your device
2. Ensure device and computer are on same network
3. Update API URL in `.env` to your computer's IP
4. Scan QR code from Expo Dev Tools

## 🚀 Building for Production

### Android APK
```bash
expo build:android
```

### iOS IPA
```bash
expo build:ios
```

## 🔧 Troubleshooting

### Cannot connect to API
- Check API URL in `.env`
- Ensure backend is running
- For Android emulator, use `10.0.2.2` instead of `localhost`
- For physical device, use computer's IP address

### Maps not showing
- Check internet connection
- Verify Google Maps API key (Android)
- Enable location permissions

### Build errors
```bash
# Clear cache
expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install
```

## 📄 API Integration

The app connects to the FastAPI backend at `http://localhost:8000`

### Endpoints Used
- `POST /api/auth/login` - User authentication
- `GET /api/buses` - Get all buses
- `GET /api/routes` - Get all routes
- `GET /api/routes/{id}` - Get route details
- `GET /api/stops` - Get stops
- `GET /api/bookings` - Get user bookings

## 🎨 Customization

### Theme Colors
Edit colors in individual screen styles or create a theme file.

### App Icon & Splash Screen
Replace files in `assets/` folder:
- `icon.png` - App icon (1024x1024)
- `splash.png` - Splash screen (1242x2436)
- `adaptive-icon.png` - Android adaptive icon (1024x1024)

## 📝 Notes

- This is an Expo managed workflow app
- Requires backend API to be running
- Location permissions needed for maps
- Optimized for portrait orientation

## 🔗 Related

- [Backend API](../backend/README.md)
- [Web Dashboard](../frontend/README.md)
- [Main Documentation](../README.md)

---

**Built with React Native & Expo** 📱✨
