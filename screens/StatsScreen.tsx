import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const StatsScreen = () => {
  const deliveredOrders = [
    { id: '1', restaurant: 'Pizzeria Luigi', date: '2025-01-05', price: 12 },
    { id: '2', restaurant: 'Sushi Zen', date: '2025-01-04', price: 21 },
    { id: '3', restaurant: 'Burger King', date: '2025-01-03', price: 19 },
    { id: '4', restaurant: 'La Crêperie', date: '2025-01-02', price: 10 },
  ];

  const totalOrders = deliveredOrders.length;
  const totalEarnings = deliveredOrders.reduce((sum, order) => sum + order.price, 0);
  const lastOrderDate = deliveredOrders[0]?.date || 'N/A';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistiques</Text>

      <View style={styles.summary}>
        <Text style={styles.text}>Commandes livrées : {totalOrders}</Text>
        <Text style={styles.text}>Total des gains : {totalEarnings} €</Text>
        <Text style={styles.text}>Dernière commande livrée : {lastOrderDate}</Text>
      </View>

      <Text style={styles.subTitle}>Détail des commandes livrées :</Text>
      <FlatList
        data={deliveredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Text style={styles.orderText}>
              <Text style={styles.orderLabel}>Restaurant : </Text>
              {item.restaurant}
            </Text>
            <Text style={styles.orderText}>
              <Text style={styles.orderLabel}>Date : </Text>
              {item.date}
            </Text>
            <Text style={styles.orderText}>
              <Text style={styles.orderLabel}>Gain : </Text>
              {item.price} €
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  summary: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderCard: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#dcdcdc',
    marginBottom: 10,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 5,
  },
  orderLabel: {
    fontWeight: 'bold',
  },
});

export default StatsScreen;
