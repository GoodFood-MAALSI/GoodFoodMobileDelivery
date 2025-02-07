import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import theme from '../assets/styles/themes';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        navigation.navigate('Home');
    };

    const handleForgotPassword = () => {
        navigation.navigate('ForgotPassword');
    };

    const handleSignUp = () => {
        navigation.navigate('SignUp');
    };

    return (
        <View style={styles.container}>
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

            <CustomButton text="Se connecter" onPress={handleLogin} backgroundColor={theme.colors[5]} textColor='#FFFFFF'/>

            <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>Mot de passe oublié?</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
                Vous n'avez pas de compte?{' '}
                <Text style={styles.signUpText} onPress={handleSignUp}>
                    Créez-en un
                </Text>
            </Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: theme.spacing.md,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: theme.spacing.md,
    },
    title: {
        fontSize: theme.spacing.fontSize.xxl,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        fontSize: theme.spacing.fontSize.md,
        color: '#666666',
        marginBottom: theme.spacing.lg,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: theme.spacing.lg,
    },
    forgotPasswordText: {
        fontSize: theme.spacing.fontSize.md,
        color: theme.colors[8],
    },
    footerText: {
        fontSize: theme.spacing.fontSize.md,
        color: '#666666',
    },
    signUpText: {
        color: theme.colors[8],
        fontWeight: 'bold',
    },
});
