# Mobile App Setup Guide

Complete guide to set up and run the DTMS React Native mobile application.

## Prerequisites

### Required Software
- **Node.js** 16 or higher
- **npm** or **yarn**
- **Expo CLI** (will be installed with dependencies)

### For iOS Development (Mac only)
- **Xcode** 12 or higher
- **iOS Simulator**

### For Android Development
- **Android Studio**
- **Android SDK**
- **Android Emulator** or physical device

## Quick Setup

### 1. Navigate to Mobile Directory
```bash
cd mobile
```

### 2. Run Setup Script

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Manual Setup:**
```bash
npm install
cp .env.example .env
```

### 3. Configure API URL

Edit `mobile/.env` and set the appropriate API URL:

```env
# For Android Emulator
API_URL=http://10.0.2.2:8000

# For iOS Simulator
API_URL=http://localhost:8000

# For Physical Device (replace with your computer's IP)
API_URL=http://192.168.1.100:8000
```

### 4. Start the App

```bash
# Start Expo development server
npm start

# Or run directly on platform
npm run android  # Android
npm run ios      # iOS (Mac only)
npm run web      # Web browser
```

## Finding Your Computer's IP Address

### Windows
```bash
ipconfig
# Look for "IPv4 Address" under your active network adapter
```

### Mac/Linux
```bash
ifconfig
# Look for "inet" address under your active network adapter
```

## Running on Physical Device

### 1. Install Expo Go App
- **iOS**: Download from App Store
- **Android**: Download from Google Play Store

### 2. Connect to Same Network
Ensure your device and computer are on the same Wi-Fi network.

### 3. Update API URL
Set `API_URL` in `.env` to your computer's IP address:
```env
API_URL=http://192.168.1.100:8000
```

### 4. Scan QR Code
- Run `npm start`
- Scan the QR code with:
  - **iOS**: Camera app
  - **Android**: Expo Go app

## Running on Emulator/Simulator

### Android Emulator

1. **Start Android Studio**
2. **Open AVD Manager** (Tools > AVD Manager)
3. **Create/Start Virtual Device**
4. **Run App:**
   ```bash
   npm run android
   ```

### iOS Simulator (Mac only)

1. **Install Xcode** from App Store
2. **Open Simulator:**
   ```bash
   open -a Simulator
   ```
3. **Run App:**
   ```bash
   npm run ios
   ```

## Troubleshooting

### Cannot Connect to Backend

**Problem:** App shows network errors or cannot fetch data.

**Solutions:**
1. Verify backend is running at `http://localhost:8000`
2. Check API URL in `.env` file
3. For Android emulator, use `10.0.2.2` instead of `localhost`
4. For physical device, use computer's IP address
5. Ensure device and computer are on same network
6. Check firewall settings

### Maps Not Displaying

**Problem:** Map component shows blank or doesn't load.

**Solutions:**
1. Check internet connection
2. For Android, add Google Maps API key to `app.json`:
   ```json
   {
     "android": {
       "config": {
         "googleMaps": {
           "apiKey": "YOUR_API_KEY"
         }
       }
     }
   }
   ```
3. Enable location permissions in device settings

### Expo Go Not Connecting

**Problem:** Cannot scan QR code or app won't load.

**Solutions:**
1. Ensure device and computer on same Wi-Fi
2. Try tunnel mode: `expo start --tunnel`
3. Restart Expo development server
4. Clear Expo cache: `expo start -c`

### Build Errors

**Problem:** App fails to build or start.

**Solutions:**
```bash
# Clear cache
expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install

# Clear watchman (Mac/Linux)
watchman watch-del-all

# Reset Metro bundler
npx react-native start --reset-cache
```

### Login Issues

**Problem:** Cannot login or authentication fails.

**Solutions:**
1. Verify backend is running
2. Check API URL configuration
3. Use correct credentials:
   - Email: `admin@smartdtc.com`
   - Password: `admin123`
4. Check network connectivity
5. Review backend logs for errors

## Development Tips

### Hot Reload
- Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
- Enable "Fast Refresh" in developer menu

### Debug Menu
- **iOS**: `Cmd+D` in simulator
- **Android**: `Cmd+M` in emulator or shake device
- **Options**: Reload, Debug, Performance Monitor

### Debugging
```bash
# View logs
npx react-native log-android  # Android
npx react-native log-ios      # iOS

# Chrome DevTools
# Enable "Debug JS Remotely" from debug menu
```

### Performance
- Use `React.memo` for expensive components
- Implement `FlatList` for long lists
- Optimize images (use appropriate sizes)
- Enable Hermes engine (already configured)

## Building for Production

### Android APK

```bash
# Build APK
expo build:android -t apk

# Build AAB (for Play Store)
expo build:android -t app-bundle
```

### iOS IPA

```bash
# Build for App Store
expo build:ios -t archive

# Build for simulator
expo build:ios -t simulator
```

### Using EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure project
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## Environment Variables

Available environment variables in `.env`:

```env
# Backend API URL (required)
API_URL=http://localhost:8000

# Optional: Enable debug mode
DEBUG=true

# Optional: API timeout (milliseconds)
API_TIMEOUT=10000
```

## App Configuration

Edit `app.json` to customize:

```json
{
  "expo": {
    "name": "DTMS Mobile",
    "slug": "dtms-mobile",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png"
    }
  }
}
```

## Testing

### Manual Testing
1. Test on multiple devices/emulators
2. Test different network conditions
3. Test offline behavior
4. Test authentication flow
5. Test all navigation paths

### Automated Testing (Future)
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react-native jest

# Run tests
npm test
```

## Deployment Checklist

- [ ] Update version in `app.json`
- [ ] Test on physical devices
- [ ] Verify API endpoints
- [ ] Check app icons and splash screen
- [ ] Test authentication
- [ ] Test all features
- [ ] Build production APK/IPA
- [ ] Submit to stores (if applicable)

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)

## Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review [Expo Documentation](https://docs.expo.dev/)
3. Check backend API status
4. Review mobile app logs

---

**Happy Mobile Development!** 📱✨
