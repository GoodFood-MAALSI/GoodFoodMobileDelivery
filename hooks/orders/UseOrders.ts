import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAvailableOrders = (lat: number, lon: number, perimeter: number, page: number, limit: number) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setError('Token not found');
        return;
      }
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_APP_API_URL}${process.env.EXPO_PUBLIC_ORDER_API}/orders/delivery?lat=${lat}&long=${lon}&perimeter=${perimeter}&page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        setOrders(data.data.orders);
      } else {
        console.error('Error fetching available orders:', data);
        setError('Erreur lors de la récupération des commandes disponibles');
      }
    } catch (err) {
      console.error('Error during fetch:', err);
      setError('Erreur lors de la récupération des commandes disponibles');
    } finally {
      setLoading(false);
    }
  }, [lat, lon, perimeter, page, limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
};

export const useOrders = (delivererId: number, statusId: number, page: number, limit: number) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setError('Token not found');
        return;
      }
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_APP_API_URL}${process.env.EXPO_PUBLIC_ORDER_API}/orders/deliverer/${delivererId}?status_id=${statusId}&page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        setOrders(data.data.orders);
      } else {
        console.error('Error fetching orders for deliverer:', data);
        setError('Erreur lors de la récupération des commandes du livreur');
      }
    } catch (err) {
      console.error('Error during fetch:', err);
      setError('Erreur lors de la récupération des commandes du livreur');
    } finally {
      setLoading(false);
    }
  }, [delivererId, statusId, page, limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
};
