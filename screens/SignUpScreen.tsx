import React, { useState } from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import theme from '../assets/styles/themes';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../assets/styles/SignUpStyles';

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


