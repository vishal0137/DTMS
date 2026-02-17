import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Searchbar, Card, Text, ActivityIndicator, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from '../api/axios';

const RoutesScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    filterRoutes();
  }, [searchQuery, routes]);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get('/api/routes');
      setRoutes(response.data);
      setFilteredRoutes(response.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterRoutes = () => {
    if (!searchQuery) {
      setFilteredRoutes(routes);
      return;
    }

    const filtered = routes.filter(
      (route) =>
        route.route_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.route_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRoutes(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRoutes();
  };

  const renderRoute = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('RouteDetail', { routeId: item.id })}
    >
      <Card style={styles.routeCard}>
        <Card.Content>
          <View style={styles.routeHeader}>
            <View style={styles.routeNumber}>
              <Text style={styles.routeNumberText}>{item.route_number}</Text>
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.routeName}>{item.route_name}</Text>
              <View style={styles.routeDetails}>
                <Icon name="map-marker-distance" size={14} color="#64748b" />
                <Text style={styles.routeDetailText}>
                  {item.distance_km.toFixed(1)} km
                </Text>
                <Icon name="clock-outline" size={14} color="#64748b" style={{ marginLeft: 12 }} />
                <Text style={styles.routeDetailText}>
                  {item.estimated_duration_minutes} min
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.routeFooter}>
            <Chip
              icon="currency-inr"
              style={styles.fareChip}
              textStyle={styles.fareText}
            >
              ₹{Math.round(item.fare)}
            </Chip>
            {item.is_active && (
              <Chip
                icon="check-circle"
                style={styles.activeChip}
                textStyle={styles.activeText}
              >
                Active
              </Chip>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bus Routes</Text>
        <Text style={styles.subtitle}>{routes.length} routes available</Text>
      </View>

      <Searchbar
        placeholder="Search routes..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <FlatList
        data={filteredRoutes}
        renderItem={renderRoute}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="routes" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>No routes found</Text>
          </View>
        }
      />
    </View>
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
  searchBar: {
    margin: 16,
    elevation: 2,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  routeCard: {
    marginBottom: 12,
  },
  routeHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  routeNumber: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  routeNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  routeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  routeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  routeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDetailText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  routeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fareChip: {
    backgroundColor: '#dcfce7',
    marginRight: 8,
  },
  fareText: {
    color: '#166534',
    fontWeight: 'bold',
  },
  activeChip: {
    backgroundColor: '#dbeafe',
  },
  activeText: {
    color: '#1e40af',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 16,
  },
});

export default RoutesScreen;
