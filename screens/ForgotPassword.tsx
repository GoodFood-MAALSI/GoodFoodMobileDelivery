import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import colors from '../assets/color';

export default function ForgotPasswordScreen({ navigation }: any) {
    const [email, setEmail] = useState('');

    const handlePasswordReset = () => {
        alert(`Un lien de réinitialisation a été envoyé à ${email}.`);
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <Text style={styles.title}>Mot de passe oublié</Text>
            <Text style={styles.subtitle}>
                Entrez votre adresse mail pour recevoir un lien de réinitialisation.
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Adresse Mail"
                placeholderTextColor="#B0B0B0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                <Text style={styles.buttonText}>Envoyer le lien</Text>
            </TouchableOpacity>
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
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
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
    button: {
        width: '100%',
        height: 50,
        backgroundColor: colors[5],
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
