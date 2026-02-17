import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Web fallback for MapView
const MapView = ({ children, style, initialRegion, ...props }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.placeholder}>
        <Text style={styles.text}>📍 Map View</Text>
        <Text style={styles.subtext}>
          Maps are available on mobile devices
        </Text>
        <Text style={styles.info}>
          {initialRegion && `Location: ${initialRegion.latitude.toFixed(4)}, ${initialRegion.longitude.toFixed(4)}`}
        </Text>
      </View>
    </View>
  );
};

const Marker = ({ coordinate, title, description }) => null;
const Polyline = ({ coordinates }) => null;

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
