import React from 'react';
import { Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLogin } from '../hooks/auth/UseLogin';
import styles from '../assets/styles/LoginStyles';
import colors from '../assets/styles/colors';

export default function LoginScreen({ navigation }: any) {
  const { email, setEmail, password, setPassword, error, isLoading, handleLogin } = useLogin();

  const onLoginPress = async () => {
    const success = await handleLogin();
    if (success) {
      navigation.navigate('Tabs', { screen: 'Accueil' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Bienvenue</Text>
      <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>

      {error && <Text style={{ color: colors.danger }}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Adresse Mail"
        placeholderTextColor="#B0B0B0"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de Passe"
        placeholderTextColor="#B0B0B0"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={onLoginPress} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Chargement...' : 'Se connecter'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPasswordText}>Mot de passe oublié?</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Vous n'avez pas de compte?{' '}
        <Text style={styles.signUpText} onPress={() => navigation.navigate('SignUp')}>
          Créez-en un
        </Text>
      </Text>
    </SafeAreaView>
  );
}
