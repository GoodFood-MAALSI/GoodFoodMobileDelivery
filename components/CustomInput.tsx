import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import theme from '../assets/styles/themes';

interface CustomInputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric';
}

const CustomInput: React.FC<CustomInputProps> = ({
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = 'default',
}) => {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#B0B0B0"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize="none"
        />
    );
};

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#F9F9F9',
        borderRadius: theme.spacing.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        fontSize: theme.spacing.fontSize.md,
        color: theme.colors.text,
    },
});

export default CustomInput;
