import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import MapView, { Marker } from '../components/PlatformMapView';
import axios from '../api/axios';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalBuses: 0,
    activeBuses: 0,
    totalRoutes: 0,
    totalBookings: 0,
  });
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [busesRes, routesRes, bookingsRes] = await Promise.all([
        axios.get('/api/buses'),
        axios.get('/api/routes'),
        axios.get('/api/bookings'),
      ]);

      const busesData = busesRes.data;
      setBuses(busesData);

      setStats({
        totalBuses: busesData.length,
        activeBuses: busesData.filter(b => b.is_active).length,
        totalRoutes: routesRes.data.length,
        totalBookings: bookingsRes.data.length,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>🚌 DTMS Dashboard</Text>
        <Text style={styles.subtitle}>Real-time Transit Tracking</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <Card style={[styles.statCard, { backgroundColor: '#dbeafe' }]}>
            <Card.Content>
              <Text style={styles.statValue}>{stats.totalBuses}</Text>
              <Text style={styles.statLabel}>Total Buses</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: '#dcfce7' }]}>
            <Card.Content>
              <Text style={styles.statValue}>{stats.activeBuses}</Text>
              <Text style={styles.statLabel}>Active Buses</Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.statsRow}>
          <Card style={[styles.statCard, { backgroundColor: '#fef3c7' }]}>
            <Card.Content>
              <Text style={styles.statValue}>{stats.totalRoutes}</Text>
              <Text style={styles.statLabel}>Routes</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: '#fce7f3' }]}>
            <Card.Content>
              <Text style={styles.statValue}>{stats.totalBookings}</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </Card.Content>
          </Card>
        </View>
      </View>

      {/* Live Map */}
      <Card style={styles.mapCard}>
        <Card.Title title="Live Bus Tracking" />
        <Card.Content>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 28.6139,
              longitude: 77.2090,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5,
            }}
          >
            {buses.map((bus) => (
              <Marker
                key={bus.id}
                coordinate={{
                  latitude: bus.current_latitude,
                  longitude: bus.current_longitude,
                }}
                title={bus.bus_number}
                description={`${bus.bus_type} - ${bus.is_active ? 'Active' : 'Inactive'}`}
                pinColor={bus.is_active ? '#22c55e' : '#ef4444'}
              />
            ))}
          </MapView>
        </Card.Content>
      </Card>

      {/* Active Buses List */}
      <Card style={styles.busesCard}>
        <Card.Title title="Active Buses" subtitle={`${stats.activeBuses} buses on route`} />
        <Card.Content>
          {buses
            .filter(bus => bus.is_active)
            .slice(0, 5)
            .map((bus) => (
              <View key={bus.id} style={styles.busItem}>
                <View style={styles.busInfo}>
                  <Text style={styles.busNumber}>{bus.bus_number}</Text>
                  <Text style={styles.busType}>{bus.bus_type}</Text>
                </View>
                <View style={styles.busStatus}>
                  <View style={styles.activeIndicator} />
                  <Text style={styles.busSpeed}>{bus.current_speed} km/h</Text>
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
  header: {
    padding: 20,
    backgroundColor: '#2563eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#dbeafe',
    marginTop: 4,
  },
  statsContainer: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
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
  busesCard: {
    margin: 16,
  },
  busItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  busInfo: {
    flex: 1,
  },
  busNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  busType: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  busStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginRight: 8,
  },
  busSpeed: {
    fontSize: 14,
    color: '#64748b',
  },
});

export default HomeScreen;
