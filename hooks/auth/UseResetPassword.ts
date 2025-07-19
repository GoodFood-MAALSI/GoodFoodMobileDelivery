import { useState } from 'react';

export const useResetPassword = () => {
    const [hash, setHash] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const validate = () => {
        if (!hash) {
            setError('Le hash est requis');
            return false;
        }
        setError(null);
        return true;
    };

    const handleResetPassword = async () => {
        if (validate()) {
            try {
                const response = await fetch(process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_DELIVERY_API + '/auth/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        hash,
                        password: newPassword,
                    }),
                });

                const { data } = await response.json();

                if (response.ok) {
                    console.log("Password reset success")
                    return true;
                } else {
                    console.error('Reset Password error')
                    return false;
                }
            } catch (error) {
                console.error('Reset Password error:', error);
                setError('Une erreur est survenue. Veuillez réessayer.');
                return false;
            }
        }
    };

    return { hash, setHash, newPassword, setNewPassword, handleResetPassword };
};
