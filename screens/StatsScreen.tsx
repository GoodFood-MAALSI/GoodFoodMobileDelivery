import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import CustomCard from '../components/CustomCard';
import CustomButton from '../components/CustomButton';
import { LineChart } from 'react-native-chart-kit';
import theme from '../assets/styles/themes';

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit' }).format(date);
};

const getLast7Days = () => {
  const today = new Date();
  return [...Array(7)].map((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    return formatDate(date);
  }).reverse();
};

const getEarningsForLast7Days = (orders: { date: string; price: number }[]) => {
  const last7Days = getLast7Days();
  const groupedData: { [date: string]: number } = {};

  orders.forEach(order => {
    const formattedDate = formatDate(new Date(order.date));
    groupedData[formattedDate] = (groupedData[formattedDate] || 0) + order.price;
  });

  return last7Days.map(date => ({
    date,
    total: groupedData[date] || 0,
  }));
};

const StatsScreen = () => {
  const [showAllOrders, setShowAllOrders] = useState(false);

  const deliveredOrders = [
    { id: '1', restaurant: 'Pizzeria Luigi', date: '2025-02-06', price: 12 },
    { id: '2', restaurant: 'Sushi Zen', date: '2025-02-04', price: 9 },
    { id: '3', restaurant: 'Burger King', date: '2025-02-03', price: 19 },
    { id: '4', restaurant: 'La Crêperie', date: '2025-02-02', price: 12 },
    { id: '5', restaurant: 'La Crêperie', date: '2025-02-01', price: 17 },
    { id: '6', restaurant: 'La Crêperie', date: '2025-01-31', price: 8 },
    { id: '7', restaurant: 'Sushi Zen', date: '2025-02-04', price: 29 },
    { id: '8', restaurant: 'La Crêperie', date: '2025-01-30', price: 2 },
  ];

  const totalOrders = deliveredOrders.length;
  const totalEarnings = deliveredOrders.reduce((sum, order) => sum + order.price, 0);
  const lastOrderDate = deliveredOrders.length ? formatDate(new Date(deliveredOrders[deliveredOrders.length - 1].date)) : 'N/A';

  const last7DaysData = getEarningsForLast7Days(deliveredOrders);

  const chartData = {
    labels: last7DaysData.map(order => order.date),
    datasets: [
      {
        data: last7DaysData.map(order => order.total),
        strokeWidth: 2,
      },
    ],
  };

  const sortedOrders = [...deliveredOrders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const displayedOrders = showAllOrders ? sortedOrders : sortedOrders.slice(0, 5);

  const renderHeader = () => (
    <View>
      <CustomCard
        title="Récapitulatif"
        details={[
          { label: 'Commandes livrées', value: totalOrders.toString() },
          { label: 'Total des gains', value: `${totalEarnings} €` },
          { label: 'Dernière commande livrée', value: lastOrderDate },
        ]}
        buttons={[]}
      />

      <Text style={styles.subTitle}>Gains sur les 7 derniers jours</Text>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 40}
        height={220}
        yAxisSuffix="€"
        chartConfig={{
          backgroundGradientFrom: theme.colors.primary,
          backgroundGradientTo: theme.colors.secondary,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: theme.spacing.borderRadius.md,
          },
        }}
        bezier
        style={styles.chart}
      />

      <Text style={styles.subTitle}>Détail des commandes livrées :</Text>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={renderHeader}
      data={displayedOrders}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CustomCard
          title={item.restaurant}
          details={[
            { label: 'Date', value: formatDate(new Date(item.date)) },
            { label: 'Gain', value: `${item.price} €` },
          ]}
          buttons={[]}
        />
      )}
      contentContainerStyle={styles.container}
      ListFooterComponent={
        deliveredOrders.length > 5 ? (
          <CustomButton
            text={showAllOrders ? 'Voir moins' : 'Voir plus'}
            onPress={() => setShowAllOrders(!showAllOrders)}
            backgroundColor={theme.colors.primary}
            size="medium"
          />
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.spacing.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    color: theme.colors.text,
  },
  subTitle: {
    fontSize: theme.spacing.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  chart: {
    borderRadius: theme.spacing.borderRadius.md,
    marginBottom: theme.spacing.md,
    alignSelf: 'center',
  },
});

export default StatsScreen;
