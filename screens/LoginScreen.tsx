import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import colors from '../assets/color';

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

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>

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
        padding: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        fontSize: 16,
        color: '#333333',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: colors[8],
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: colors[5],
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerText: {
        fontSize: 14,
        color: '#666666',
    },
    signUpText: {
        color: colors[8],
        fontWeight: 'bold',
    },
});
