import { useState } from 'react';

export const useSignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      setError('Tous les champs sont requis');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSignUp = async () => {
    if (validate()) {
      setIsLoading(true);
      try {
        const response = await fetch(process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_DELIVERY_API + '/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            first_name: firstName,
            last_name: lastName,
          }),
        });

        const { data } = await response.json();

        if (response.ok) {
          console.log('Sign Up success:', data);
          setIsLoading(false);
          return true;
        } else {
          setError(data.message || 'Échec de l\'inscription');
          setIsLoading(false);
          return false;
        }
      } catch (error) {
        console.error('Sign Up error:', error);
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
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    error,
    isLoading,
    handleSignUp,
  };
};
