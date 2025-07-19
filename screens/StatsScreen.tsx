import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, Alert } from 'react-native';
import CustomCard from '../components/CustomCard';
import CustomButton from '../components/CustomButton';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../assets/styles/themes';
import { useOrders } from '../hooks/orders/UseOrders';
import styles from '../assets/styles/StatsStyles';
import { useUser } from '../Context/UserContext';

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

const getEarningsForLast7Days = (orders: { created_at: string; delivery_costs: string }[]) => {
  const last7Days = getLast7Days();
  const groupedData: { [date: string]: number } = {};

  orders.forEach(order => {
    const formattedDate = formatDate(new Date(order.created_at));
    const totalPrice = parseFloat(order.delivery_costs);
    groupedData[formattedDate] = (groupedData[formattedDate] || 0) + totalPrice;
  });

  return last7Days.map(date => ({
    date,
    total: groupedData[date] || 0,
  }));
};

const StatsScreen = () => {
  const { user } = useUser();
  const [showAllOrders, setShowAllOrders] = useState(false);

  const { orders: deliveredOrders, loading: loadingDeliveredOrders, error: deliveredOrdersError } = useOrders(
    user?.id,
    5,
    1,
    10
  );

  useEffect(() => {
    if (deliveredOrdersError) {
      Alert.alert("Erreur", deliveredOrdersError);
    }
  }, [deliveredOrdersError]);

  const totalOrders = deliveredOrders.length;
  const totalEarnings = deliveredOrders.reduce((sum, order) => sum + parseFloat(order.delivery_costs), 0);
  const lastOrderDate = deliveredOrders.length ? formatDate(new Date(deliveredOrders[deliveredOrders.length - 1].created_at)) : 'N/A';

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

  const sortedOrders = [...deliveredOrders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const displayedOrders = showAllOrders ? sortedOrders : sortedOrders.slice(0, 5);

  const renderHeader = () => (
    <View>
      <CustomCard
        title="Récapitulatif"
        details={[
          { label: 'Commandes livrées', value: totalOrders.toString() },
          { label: 'Total des gains', value: `${totalEarnings.toFixed(2)} €` },
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
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
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
    <SafeAreaView>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={displayedOrders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CustomCard
            title={item.restaurant.name}
            details={[
              { label: 'Date', value: formatDate(new Date(item.created_at)) },
              { label: 'Gain', value: `${item.delivery_costs} €` },
              { label: 'Client', value: `${item.client.first_name} ${item.client.last_name}` },
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
    </SafeAreaView>
  );
};

export default StatsScreen;
