import { useState } from 'react';

export const useUpdateOrderStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateOrderStatus = async (orderId: number, statusId: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_APP_API_URL}${process.env.EXPO_PUBLIC_ORDER_API}/orders/${orderId}/status`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        status_id: statusId,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du statut de la commande');
            }

            const data = await response.json();
            return data;
        } catch (err: any) {
            setError(err.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    return { updateOrderStatus, loading, error };
};
