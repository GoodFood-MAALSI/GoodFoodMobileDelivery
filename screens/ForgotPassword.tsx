import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import colors from '../assets/styles/colors';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import theme from '../assets/styles/themes';

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
            <CustomInput 
                placeholder="Adresse Mail" 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address" 
            />
            <CustomButton text="Envoyer le lien" onPress={handlePasswordReset} backgroundColor={theme.colors[5]} textColor='#FFFFFF'/>
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
    }
});
