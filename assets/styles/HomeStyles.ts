import { StyleSheet } from "react-native";
import theme from "./themes";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statusContainer: {
        padding: 15,
        backgroundColor: '#F8F9FA',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    statusText: {
        fontSize: 18,
        color: '#333333',
    },
    statusAvailable: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    statusUnavailable: {
        color: '#FF5722',
        fontWeight: 'bold',
    },
    map: {
        flex: 1.5,
    },
    ordersContainer: {
        flex: 2,
        padding: 15,
    },
    ordersTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333333',
    },
    unavailableContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    unavailableText: {
        fontSize: 16,
        color: theme.colors[7],
        textAlign: 'center',
        fontWeight: 'bold',
    },
    modalcontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modaltitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center'
    },
    modalinput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        width: 250,
        marginBottom: 20,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    modalbuttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 250,
    },
});

export default styles;
