import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useRefreshToken = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshAccessToken = async () => {
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    if (!refreshToken) {
      setError('Aucun refresh token trouvé');
      return false;
    }

    setIsRefreshing(true);

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_APP_API_URL}/client/api/auth/refresh`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      const { data } = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('refreshToken', data.refreshToken);

        setIsRefreshing(false);
        return true;
      } else {
        setError(data.message || 'Échec du rafraîchissement du token');
        setIsRefreshing(false);
        return false;
      }
    } catch (err) {
      setError('Erreur de réseau lors du rafraîchissement du token');
      setIsRefreshing(false);
      return false;
    }
  };

  return {
    isRefreshing,
    error,
    refreshAccessToken,
  };
};

export default useRefreshToken;
