import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text } from 'react-native-paper';

const BookingDetailScreen = ({ route }) => {
  const { booking } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Booking Details" />
        <Card.Content>
          <Text>Booking ID: {booking.id}</Text>
          {/* Add more booking details here */}
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
  card: {
    margin: 16,
  },
});

export default BookingDetailScreen;
