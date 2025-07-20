import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUpdateOrderStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateOrderStatus = async (orderId: number, statusId: number) => {
        setLoading(true);
        setError(null);

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                setError('Token not found');
                return;
            }

            const response = await fetch(
                `${process.env.EXPO_PUBLIC_APP_API_URL}${process.env.EXPO_PUBLIC_ORDER_API}/orders/${orderId}/status`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,  // Ajout du token dans les en-têtes
                    },
                    body: JSON.stringify({
                        status_id: statusId,
                    }),
                }
            );

            if (!response.ok) {
                console.error('Error during status update:', await response.json());
                throw new Error('Erreur lors de la mise à jour du statut de la commande');
            }

            const data = await response.json();
            console.log('Order status updated successfully:', data);
            return data;
        } catch (err: any) {
            console.error('Error updating order status:', err);
            setError(err.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    return { updateOrderStatus, loading, error };
};
