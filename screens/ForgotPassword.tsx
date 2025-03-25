import React, { useState } from 'react';
import { Text, Image } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import theme from '../assets/styles/themes';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../assets/styles/ForgotPasswordStyles';

export default function ForgotPasswordScreen({ navigation }: any) {
    const [email, setEmail] = useState('');

    const handlePasswordReset = () => {
        alert(`Un lien de réinitialisation a été envoyé à ${email}.`);
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.container}>
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
        </SafeAreaView>
    );
}


