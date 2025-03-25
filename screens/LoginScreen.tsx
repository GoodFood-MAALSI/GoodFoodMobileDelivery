import React, { useState } from 'react';
import { Text, TouchableOpacity, Image } from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import theme from '../assets/styles/themes';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../assets/styles/LoginStyles';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        navigation.navigate('Tabs', { screen: 'Accueil' });
    };

    const handleForgotPassword = () => {
        navigation.navigate('ForgotPassword');
    };

    const handleSignUp = () => {
        navigation.navigate('SignUp');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <Text style={styles.title}>Bienvenue</Text>
            <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>

            <CustomInput
                placeholder="Adresse Mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <CustomInput
                placeholder="Mot de Passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <CustomButton text="Se connecter" onPress={handleLogin} backgroundColor={theme.colors[5]} textColor='#FFFFFF' />

            <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>Mot de passe oublié?</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
                Vous n'avez pas de compte?{' '}
                <Text style={styles.signUpText} onPress={handleSignUp}>
                    Créez-en un
                </Text>
            </Text>
        </SafeAreaView>
    );
}
