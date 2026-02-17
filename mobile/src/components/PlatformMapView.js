import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';

// Web fallback component
const WebMapView = ({ children, style, initialRegion, ...props }) => (
  <View style={[styles.container, style]}>
    <View style={styles.placeholder}>
      <Text style={styles.text}>📍 Map View</Text>
      <Text style={styles.subtext}>Maps are available on mobile devices</Text>
      {initialRegion && (
        <Text style={styles.info}>
          Location: {initialRegion.latitude.toFixed(4)}, {initialRegion.longitude.toFixed(4)}
        </Text>
      )}
    </View>
  </View>
);

const WebMarker = () => null;
const WebPolyline = () => null;

// Export based on platform
let MapView, Marker, Polyline;

if (Platform.OS === 'web') {
  MapView = WebMapView;
  Marker = WebMarker;
  Polyline = WebPolyline;
} else {
  // This will only be evaluated on native platforms
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
    Polyline = Maps.Polyline;
  } catch (e) {
    // Fallback if maps not available
    MapView = WebMapView;
    Marker = WebMarker;
    Polyline = WebPolyline;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 300,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  info: {
    fontSize: 12,
    color: '#94a3b8',
  },
});

export default MapView;
export { Marker, Polyline };
