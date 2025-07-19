import { useState } from 'react';

export const useCreateDelivery = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createDelivery = async (orderId: number, transportModeId: number, deliveryStatusId: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/deliveries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
            setError(err.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    return { createDelivery, loading, error };
};
