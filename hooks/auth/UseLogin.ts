import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../../Context/UserContext';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [email, setEmail] = useState<string>('antoine.griezmann@goodfood-maalsi.com');
  // const [password, setPassword] = useState<string>('Antoine123!');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { setToken, setRefreshToken, setTokenExpires, setUser } = useUser();

  const validate = () => {
    if (!email || !password) {
      setError('Tous les champs sont requis');
      return false;
    }
    setError(null);
    return true;
  };

  const handleLogin = async () => {
    setIsLoading(true);
    if (validate()) {
      console.log(process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_DELIVERY_API + '/auth/login', JSON.stringify({
        email,
        password,
      }),)
      try {
        const response = await fetch(process.env.EXPO_PUBLIC_APP_API_URL + process.env.EXPO_PUBLIC_DELIVERY_API + '/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const { data } = await response.json();
        if (response.ok) {
          const timestamp = data.tokenExpires;
          const tokenLifeDuration = timestamp - Date.now();
          const bufferDuration = tokenLifeDuration * 0.10;
          const expiryTimeWithBuffer = timestamp - bufferDuration;

          await AsyncStorage.setItem('token', data.token);
          await AsyncStorage.setItem('refreshToken', data.refreshToken);
          await AsyncStorage.setItem('tokenExpires', String(expiryTimeWithBuffer));
          await AsyncStorage.setItem('user', JSON.stringify(data.user));

          setToken(data.token);
          setRefreshToken(data.refreshToken);
          setTokenExpires(expiryTimeWithBuffer);
          setUser(data.user);

          console.log('Login success:', data);
          return true;
        } else {
          setError(data.message || 'Connexion échouée');
          console.warn('Login failed:', data);
          return false;
        }
      } catch (error) {
        console.error('Login error:', error);
        setError('Une erreur est survenue. Veuillez réessayer.');
        return false;
      } finally {
        setIsLoading(false);
      }
    }
    return false;
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleLogin,
  };
};
