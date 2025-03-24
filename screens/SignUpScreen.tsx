import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import theme from '../assets/styles/themes';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = () => {
        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }
        alert("Compte créé avec succès !");
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <Text style={styles.title}>Créer un compte</Text>
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
            <CustomInput 
                placeholder="Confirmer le mot de passe" 
                value={password} 
                onChangeText={setConfirmPassword} 
                secureTextEntry
            />
            <CustomButton text="Créer un compte" onPress={handleSignUp} backgroundColor={theme.colors[5]} textColor='#FFFFFF'/>
        </SafeAreaView>
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
    }
});
