import { useState } from 'react';

export const useForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    if (!email) {
      setError('L\'adresse email est requise');
      return false;
    }
    setError(null);
    return true;
  };

  const handlePasswordReset = async () => {
    if (validate()) {
      setIsLoading(true);
      try {
        const response = await fetch(process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_DELIVERY_API + '/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
          }),
        });

        const { data } = await response.json();

        if (response.ok) {
          console.log('Password reset request success:', data);
          setIsLoading(false);
          return true;
        } else {
          setError(data.message || 'Échec de l\'envoi du lien');
          setIsLoading(false);
          return false;
        }
      } catch (error) {
        console.error('Password reset error:', error);
        setError('Une erreur est survenue. Veuillez réessayer.');
        setIsLoading(false);
        return false;
      }
    }
    return false;
  };

  return {
    email,
    setEmail,
    error,
    isLoading,
    handlePasswordReset,
  };
};
