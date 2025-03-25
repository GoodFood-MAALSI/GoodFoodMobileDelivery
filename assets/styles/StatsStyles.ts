import { StyleSheet } from "react-native";
import theme from "./themes";

const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.md,
    },
    title: {
      fontSize: theme.spacing.fontSize.xl,
      fontWeight: 'bold',
      marginBottom: theme.spacing.md,
      textAlign: 'center',
      color: theme.colors.text,
    },
    subTitle: {
      fontSize: theme.spacing.fontSize.lg,
      fontWeight: 'bold',
      marginBottom: theme.spacing.sm,
      color: theme.colors.text,
    },
    chart: {
      borderRadius: theme.spacing.borderRadius.md,
      marginBottom: theme.spacing.md,
      alignSelf: 'center',
    },
  });

  export default styles;