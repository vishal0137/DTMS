import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, Avatar, List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label={user?.full_name?.substring(0, 2).toUpperCase() || 'U'}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.full_name || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
        </View>
      </View>

      <Card style={styles.card}>
        <Card.Title title="Account Information" />
        <Card.Content>
          <View style={styles.infoRow}>
            <Icon name="phone" size={20} color="#64748b" />
            <Text style={styles.infoText}>{user?.phone_number || 'Not provided'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="email" size={20} color="#64748b" />
            <Text style={styles.infoText}>{user?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="shield-account" size={20} color="#64748b" />
            <Text style={styles.infoText}>{user?.role}</Text>
          </View>
        </Card.Content>
      </Card>

      {user?.wallet && (
        <Card style={styles.card}>
          <Card.Title title="Wallet" />
          <Card.Content>
            <View style={styles.walletBalance}>
              <Icon name="wallet" size={32} color="#2563eb" />
              <View style={styles.balanceInfo}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <Text style={styles.balanceAmount}>₹{user.wallet.balance.toFixed(2)}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <List.Section>
          <List.Item
            title="Settings"
            left={(props) => <List.Icon {...props} icon="cog" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Help & Support"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="About"
            left={(props) => <List.Icon {...props} icon="information" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </List.Section>
      </Card>

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        icon="logout"
        buttonColor="#ef4444"
      >
        Logout
      </Button>

      <View style={styles.footer}>
        <Text style={styles.footerText}>DTMS Mobile v1.0.0</Text>
        <Text style={styles.footerSubtext}>Delhi Transport Management System</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 32,
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#1e40af',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#dbeafe',
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  card: {
    margin: 16,
    marginBottom: 0,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  infoText: {
    fontSize: 14,
    color: '#1e293b',
    marginLeft: 16,
  },
  walletBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
  },
  balanceInfo: {
    marginLeft: 16,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  logoutButton: {
    margin: 16,
    marginTop: 24,
  },
  footer: {
    alignItems: 'center',
    padding: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: 'bold',
  },
  footerSubtext: {
    fontSize: 10,
    color: '#cbd5e1',
    marginTop: 4,
  },
});

export default ProfileScreen;
