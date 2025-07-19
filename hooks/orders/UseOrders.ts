import { useState, useEffect, useCallback } from 'react';

export const useAvailableOrders = (lat: number, lon: number, perimeter: number, page: number, limit: number) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    console.log("Fetching available orders...");
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_APP_API_URL}${process.env.EXPO_PUBLIC_ORDER_API}/orders/delivery?lat=${lat}&long=${lon}&perimeter=${perimeter}&page=${page}&limit=${limit}`
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Orders fetched successfully");
        setOrders(data.data.orders);
      } else {
        setError('Erreur lors de la récupération des commandes disponibles');
      }
    } catch (err) {
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
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_APP_API_URL}${process.env.EXPO_PUBLIC_ORDER_API}/orders/deliverer/${delivererId}?status_id=${statusId}&page=${page}&limit=${limit}`
      );
      const data = await response.json();
      if (response.ok) {
        setOrders(data.data.orders);
      } else {
        setError('Erreur lors de la récupération des commandes du livreur');
      }
    } catch (err) {
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
