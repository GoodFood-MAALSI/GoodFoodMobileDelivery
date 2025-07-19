import { useState } from 'react';
import { useUser } from '../../Context/UserContext';
import useRefreshToken from '../UseRefreshToken';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useVerifyDeliveryCode = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<boolean | null>(null);
    const { tokenExpires } = useUser();
    const { refreshAccessToken } = useRefreshToken();

    const isTokenExpired = () => {
        if (!tokenExpires) return true;
        return Date.now() >= tokenExpires;
    };

    const verifyDeliveryCode = async (deliveryId: string, code: string) => {
        setLoading(true);
        setError(null);
        setResult(null);

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
            const response = await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL}${process.env.EXPO_PUBLIC_DELIVERY_API}/deliveries/${deliveryId}/verify-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    code: code,
                }),
            });

            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error('Requête invalide (code non valide)');
                } else if (response.status === 401) {
                    throw new Error('Non autorisé');
                } else if (response.status === 404) {
                    throw new Error('Livraison non trouvée');
                } else {
                    throw new Error('Erreur lors de la vérification du code de livraison');
                }
            }

            const { data } = await response.json();
            console.log('Verification result:', data?.isValid);
            if (data?.isValid === true) {
                setResult(true);
            } else {
                setResult(false);
            }
        } catch (err: any) {
            console.error('Error during verification:', err);
            setError(err.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    return { verifyDeliveryCode, loading, error, result };
};
