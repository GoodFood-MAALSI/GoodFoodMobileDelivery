import { StyleSheet } from "react-native";
import theme from "./themes";

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

export default styles;