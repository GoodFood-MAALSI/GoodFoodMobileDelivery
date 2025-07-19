import React from 'react';
import { Text, TextInput, TouchableOpacity, Image } from 'react-native';
import styles from '../assets/styles/SignUpStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useConfirmEmail } from '../hooks/auth/UseConfirmEmail';

export default function ConfirmEmailScreen({ navigation }: any) {
  const { hash, setHash, error, message, handleConfirmEmail } = useConfirmEmail();

  const onConfirmPress = async () => {
    const success = await handleConfirmEmail();
    if (success) {
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Confirmer votre email</Text>

      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      {message && <Text style={{ color: 'green' }}>{message}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Hash"
        placeholderTextColor="#B0B0B0"
        value={hash}
        onChangeText={setHash}
      />

      <TouchableOpacity style={styles.button} onPress={onConfirmPress}>
        <Text style={styles.buttonText}>Confirmer l'email</Text>
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
