import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';
import theme from '../assets/styles/themes';

interface CustomCardProps {
    title: string;
    details: { label: string; value: string }[];
    buttons: { text: string; onPress: () => void; backgroundColor: string }[];
}

const CustomCard: React.FC<CustomCardProps> = ({ title, details, buttons }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            {details.map((detail, index) => (
                <Text key={index} style={styles.detailText}>
                    <Text style={styles.detailLabel}>{detail.label} : </Text>
                    {detail.value}
                </Text>
            ))}
            <View style={styles.buttonContainer}>
                {buttons.map((button, index) => (
                    <CustomButton
                        key={index}
                        text={button.text}
                        onPress={button.onPress}
                        backgroundColor={button.backgroundColor}
                        size="small"
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: theme.spacing.md,
        borderRadius: theme.spacing.borderRadius.md,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
    },
    title: {
        fontSize: theme.spacing.fontSize.lg,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    detailText: {
        fontSize: theme.spacing.fontSize.md,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    detailLabel: {
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: theme.spacing.sm,
    },
});

export default CustomCard;
