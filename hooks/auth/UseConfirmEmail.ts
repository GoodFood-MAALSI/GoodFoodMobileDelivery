import { useState } from 'react';

export const useConfirmEmail = () => {
  const [hash, setHash] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const validate = () => {
    if (!hash) {
      setError('Le hash est requis');
      return false;
    }
    setError(null);
    return true;
  };

  const handleConfirmEmail = async () => {
    if (validate()) {
      try {
        const response = await fetch(process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_DELIVERY_API + '/auth/confirm-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            hash,
          }),
        });

        const { data } = await response.json();

        if (response.ok) {
          setMessage('Votre email a été confirmé avec succès.');
          console.log('Email confirmed:', data);
          return true;
        } else {
          setError(data.message || 'Échec de la confirmation de l\'email');
          return false;
        }
      } catch (error) {
        console.error('Confirm Email error:', error);
        setError('Une erreur est survenue. Veuillez réessayer.');
        return false;
      }
    }
    return false;
  };

  return {
    hash,
    setHash,
    error,
    message,
    handleConfirmEmail,
  };
};
