import React from 'react';
import { Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../assets/styles/ForgotPasswordStyles';
import colors from '../assets/styles/colors';
import { useForgotPassword } from '../hooks/auth/UseForgotPassword';

export default function ForgotPasswordScreen({ navigation }: any) {
  const { email, setEmail, error, isLoading, handlePasswordReset } = useForgotPassword();

  const onResetPress = async () => {
    const success = await handlePasswordReset();
    if (success) {
      alert(`Un lien de réinitialisation a été envoyé à ${email}.`);
      navigation.navigate('Reset');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Mot de passe oublié</Text>
      <Text style={styles.subtitle}>
        Entrez votre adresse mail pour recevoir un lien de réinitialisation.
      </Text>

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

      <TouchableOpacity style={styles.button} onPress={onResetPress} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Chargement...' : 'Envoyer le lien'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
