import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import theme from '../assets/styles/themes';

interface CustomButtonProps {
    text: string;
    onPress: () => void;
    backgroundColor?: string;
    textColor?: string;
    size?: 'small' | 'medium' | 'large';
    style?: ViewStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    text,
    onPress,
    backgroundColor = theme.colors.primary,
    textColor = '#FFFFFF',
    size = 'medium',
    style = {},
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                size === 'small' && styles.small,
                size === 'medium' && styles.medium,
                size === 'large' && styles.large,
                { backgroundColor },
                style,
            ]}
            onPress={onPress}
        >
            <Text style={[styles.buttonText,size === 'small' && styles.smallText,
                size === 'medium' && styles.mediumText,
                size === 'large' && styles.largeText, { color: textColor }]}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: theme.spacing.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    small: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.sm,
        margin: theme.spacing.sm,
    },
    medium: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        margin: theme.spacing.md,
    },
    large: {
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.lg,
        margin: theme.spacing.lg,
    },
    buttonText: {
        fontWeight: 'bold',
    },
    smallText: {
        fontSize: theme.spacing.fontSize.sm,
    },
    mediumText: {
        fontSize: theme.spacing.fontSize.md,
    },
    largeText: {
        fontSize: theme.spacing.fontSize.lg,
    },
});

export default CustomButton;
