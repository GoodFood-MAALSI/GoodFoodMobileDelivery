import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../assets/styles/ForgotPasswordStyles';
import colors from '../assets/styles/colors';
import { useResetPassword } from '../hooks/auth/UseResetPassword';

export default function ResetPasswordScreen({ navigation }: any) {
  const { hash, setHash, newPassword, setNewPassword, handleResetPassword } = useResetPassword();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    if (!hash || !newPassword || !confirmPassword) {
      setError('Tous les champs sont requis');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    setError(null);
    return true;
  };

  const onResetPress = async () => {
    if (validate()) {
      setIsLoading(true);
      try {
        const success = await handleResetPassword();
        if (success) {
          alert('Votre mot de passe a été réinitialisé avec succès.');
          navigation.navigate('Login');
        }
      } catch (error) {
        setError('Erreur de réinitialisation du mot de passe');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Réinitialiser le mot de passe</Text>

      {error && <Text style={{ color: colors.danger }}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Hash (reçu par email)"
        placeholderTextColor="#B0B0B0"
        value={hash}
        onChangeText={setHash}
      />

      <TextInput
        style={styles.input}
        placeholder="Nouveau mot de passe"
        placeholderTextColor="#B0B0B0"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmer le mot de passe"
        placeholderTextColor="#B0B0B0"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={onResetPress} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Chargement...' : 'Réinitialiser'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
