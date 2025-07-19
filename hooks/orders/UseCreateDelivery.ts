import { useState } from 'react';
import { useUser } from '../../Context/UserContext';
import useRefreshToken from '../UseRefreshToken';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useCreateDelivery = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { tokenExpires } = useUser();
    const { refreshAccessToken } = useRefreshToken();

    const isTokenExpired = () => {
        if (!tokenExpires) return true;
        return Date.now() >= tokenExpires;
    };

    const createDelivery = async (orderId: number, transportModeId: number, deliveryStatusId: number) => {
        setLoading(true);
        setError(null);
        if (isTokenExpired()) {
            const refreshSuccess = await refreshAccessToken();
            if (!refreshSuccess) {
                setError('Échec du rafraîchissement du token. Veuillez vous reconnecter.');
                setLoading(false);
                return;
            }
        }
        const token = await AsyncStorage.getItem('token');

        if (!token) {
            setError('Vous devez être connecté');
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL}${process.env.EXPO_PUBLIC_DELIVERY_API}/deliveries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    order_id: orderId,
                    transport_mode_id: transportModeId,
                    delivery_status_id: deliveryStatusId,
                }),
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la création de la livraison');
            }
            const data = await response.json();
            return data;
        } catch (err: any) {
            console.error('Error while creating delivery:', err); // Log the error in case of failure
            setError(err.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    return { createDelivery, loading, error };
};
