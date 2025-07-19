import React from 'react';
import { Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../assets/styles/SignUpStyles';
import colors from '../assets/styles/colors';
import { useSignUp } from '../hooks/auth/UseSignup';

export default function SignUpScreen({ navigation }: any) {
  const {
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
  } = useSignUp();

  const onSignUpPress = async () => {
    const success = await handleSignUp();
    if (success) {
      navigation.navigate('Confirmation');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Créer un compte</Text>

      {error && <Text style={{ color: colors.danger }}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Prénom"
        placeholderTextColor="#B0B0B0"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom"
        placeholderTextColor="#B0B0B0"
        value={lastName}
        onChangeText={setLastName}
      />
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
        placeholder="Mot de passe"
        placeholderTextColor="#B0B0B0"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmez le mot de passe"
        placeholderTextColor="#B0B0B0"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={onSignUpPress} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Chargement...' : 'Créer un compte'}</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Vous avez déjà un compte?{' '}
        <Text style={styles.signUpText} onPress={() => navigation.navigate('Login')}>
          Connectez-vous
        </Text>
      </Text>
    </SafeAreaView>
  );
}
