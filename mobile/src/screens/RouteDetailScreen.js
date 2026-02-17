import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Card, Text, ActivityIndicator, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Polyline, Marker } from '../components/PlatformMapView';
import axios from '../api/axios';

const { width } = Dimensions.get('window');

const RouteDetailScreen = ({ route }) => {
  const { routeId } = route.params;
  const [loading, setLoading] = useState(true);
  const [routeData, setRouteData] = useState(null);
  const [stops, setStops] = useState([]);

  useEffect(() => {
    fetchRouteDetails();
  }, []);

  const fetchRouteDetails = async () => {
    try {
      const [routeRes, stopsRes] = await Promise.all([
        axios.get(`/api/routes/${routeId}`),
        axios.get(`/api/stops?route_id=${routeId}`),
      ]);

      setRouteData(routeRes.data);
      setStops(stopsRes.data);
    } catch (error) {
      console.error('Error fetching route details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const coordinates = stops.map(stop => ({
    latitude: stop.latitude,
    longitude: stop.longitude,
  }));

  return (
    <ScrollView style={styles.container}>
      {/* Route Info Card */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.routeHeader}>
            <View style={styles.routeNumber}>
              <Text style={styles.routeNumberText}>{routeData.route_number}</Text>
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.routeName}>{routeData.route_name}</Text>
              <View style={styles.badges}>
                <Chip icon="currency-inr" style={styles.fareChip}>
                  ₹{Math.round(routeData.fare)}
                </Chip>
                {routeData.is_active && (
                  <Chip icon="check-circle" style={styles.activeChip}>
                    Active
                  </Chip>
                )}
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Icon name="map-marker-distance" size={20} color="#2563eb" />
              <Text style={styles.statValue}>{routeData.distance_km.toFixed(1)} km</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
            <View style={styles.stat}>
              <Icon name="clock-outline" size={20} color="#2563eb" />
              <Text style={styles.statValue}>{routeData.estimated_duration_minutes} min</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.stat}>
              <Icon name="bus-stop" size={20} color="#2563eb" />
              <Text style={styles.statValue}>{stops.length}</Text>
              <Text style={styles.statLabel}>Stops</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Map */}
      {coordinates.length > 0 && (
        <Card style={styles.mapCard}>
          <Card.Content>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: coordinates[0].latitude,
                longitude: coordinates[0].longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
            >
              <Polyline
                coordinates={coordinates}
                strokeColor="#2563eb"
                strokeWidth={3}
              />
              {stops.map((stop, index) => (
                <Marker
                  key={stop.id}
                  coordinate={{
                    latitude: stop.latitude,
                    longitude: stop.longitude,
                  }}
                  title={stop.stop_name}
                  description={`Stop ${stop.stop_order}`}
                  pinColor={index === 0 ? '#22c55e' : index === stops.length - 1 ? '#ef4444' : '#2563eb'}
                />
              ))}
            </MapView>
          </Card.Content>
        </Card>
      )}

      {/* Stops List */}
      <Card style={styles.stopsCard}>
        <Card.Title title="Route Stops" subtitle={`${stops.length} stops`} />
        <Card.Content>
          {stops
            .sort((a, b) => a.stop_order - b.stop_order)
            .map((stop, index) => (
              <View key={stop.id} style={styles.stopItem}>
                <View style={styles.stopIndicator}>
                  <View
                    style={[
                      styles.stopCircle,
                      index === 0 && styles.startStop,
                      index === stops.length - 1 && styles.endStop,
                    ]}
                  >
                    <Text style={styles.stopNumber}>{stop.stop_order}</Text>
                  </View>
                  {index < stops.length - 1 && <View style={styles.stopLine} />}
                </View>
                <View style={styles.stopInfo}>
                  <Text style={styles.stopName}>{stop.stop_name}</Text>
                  {stop.estimated_arrival_time && (
                    <Text style={styles.stopTime}>{stop.estimated_arrival_time}</Text>
                  )}
                  {index === 0 && (
                    <Chip icon="flag" style={styles.startChip} textStyle={styles.chipText}>
                      START
                    </Chip>
                  )}
                  {index === stops.length - 1 && (
                    <Chip icon="flag-checkered" style={styles.endChip} textStyle={styles.chipText}>
                      END
                    </Chip>
                  )}
                </View>
              </View>
            ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    margin: 16,
  },
  routeHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  routeNumber: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  routeNumberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  routeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
  },
  fareChip: {
    backgroundColor: '#dcfce7',
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: '#dbeafe',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  mapCard: {
    margin: 16,
    marginTop: 0,
  },
  map: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  stopsCard: {
    margin: 16,
    marginTop: 0,
    marginBottom: 32,
  },
  stopItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stopIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  stopCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startStop: {
    backgroundColor: '#22c55e',
  },
  endStop: {
    backgroundColor: '#ef4444',
  },
  stopNumber: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stopLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#cbd5e1',
    marginVertical: 4,
  },
  stopInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  stopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  stopTime: {
    fontSize: 12,
    color: '#64748b',
  },
  startChip: {
    backgroundColor: '#dcfce7',
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  endChip: {
    backgroundColor: '#fee2e2',
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  chipText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default RouteDetailScreen;
