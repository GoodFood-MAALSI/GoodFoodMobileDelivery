import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import colors from '../assets/color';

const HomeScreen = ({ navigation }: any) => {
    const [isAvailable, setIsAvailable] = useState(true);
    const [currentLocation, setCurrentLocation] = useState<any>(null);
    const [availableOrders, setAvailableOrders] = useState([
        {
            id: '1',
            restaurant: 'Pizzeria Luigi',
            restaurantAddress: '123 Rue des Lilas',
            restaurantLocation: { latitude: 48.857, longitude: 2.351 },
            clientAddress: '456 Rue des Tulipes',
            clientLocation: { latitude: 48.860, longitude: 2.360 },
            price: 8,
        },
        {
            id: '2',
            restaurant: 'Sushi Zen',
            restaurantAddress: '45 Boulevard Haussmann',
            restaurantLocation: { latitude: 48.859, longitude: 2.354 },
            clientAddress: '789 Avenue des Champs',
            clientLocation: { latitude: 48.862, longitude: 2.370 },
            price: 15,
        },
    ]);
    const [deliveredOrders, setDeliveredOrders] = useState<any[]>([
        {
            id: '3',
            restaurant: 'Burger King',
            restaurantAddress: '22 Rue des Écoles',
            clientAddress: '12 Avenue de Paris',
            price: 12,
        },
        {
            id: '4',
            restaurant: 'La Crêperie',
            restaurantAddress: '10 Place de la République',
            clientAddress: '5 Rue des Fleurs',
            price: 10,
        },
    ]);
    const [acceptedOrder, setAcceptedOrder] = useState<any>(null);
    const [tab, setTab] = useState<'disponibles' | 'enCours' | 'livrees'>('disponibles');

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission refusée', 'Impossible d’accéder à votre position.');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setCurrentLocation(location.coords);
        })();
    }, []);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const toRad = (value: number) => (value * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleAcceptOrder = (order: any) => {
        if (acceptedOrder) {
            Alert.alert('Action impossible', 'Vous avez déjà une commande en cours.');
            return;
        }
        setAcceptedOrder(order);
        setAvailableOrders(availableOrders.filter((item) => item.id !== order.id));
        Alert.alert('Commande acceptée', `Vous avez accepté la commande de ${order.restaurant}.`);
        setTab('enCours');
    };

    const handleDeliveredOrder = () => {
        if (acceptedOrder) {
            setDeliveredOrders([...deliveredOrders, acceptedOrder]);
            setAcceptedOrder(null);
            Alert.alert('Commande livrée', 'Vous pouvez maintenant accepter une nouvelle commande.');
            setTab('livrees');
        }
    };

    const handleToggleAvailability = () => {
        if (acceptedOrder && isAvailable) {
            Alert.alert(
                'Action impossible',
                'Vous avez une commande en cours. Veuillez terminer la commande avant de vous rendre indisponible.'
            );
            return;
        }
        setIsAvailable(!isAvailable);
    };

    return (
        <View style={styles.container}>
            <View style={styles.statusContainer}>
                <Text style={styles.statusText}>
                    Statut :{' '}
                    <Text style={isAvailable ? styles.statusAvailable : styles.statusUnavailable}>
                        {isAvailable ? 'Disponible' : 'Indisponible'}
                    </Text>
                </Text>
                <TouchableOpacity style={styles.toggleButton} onPress={handleToggleAvailability}>
                    <Text style={styles.toggleButtonText}>{isAvailable ? 'Se rendre indisponible' : 'Se rendre disponible'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tabButton, tab === 'disponibles' && styles.activeTab]}
                    onPress={() => setTab('disponibles')}
                >
                    <Text style={[styles.tabText, tab === 'disponibles' && styles.activeTabText]}>Commandes disponibles</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, tab === 'enCours' && styles.activeTab]}
                    onPress={() => setTab('enCours')}
                >
                    <Text style={[styles.tabText, tab === 'enCours' && styles.activeTabText]}>Commande en cours</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, tab === 'livrees' && styles.activeTab]}
                    onPress={() => setTab('livrees')}
                >
                    <Text style={[styles.tabText, tab === 'livrees' && styles.activeTabText]}>Commandes livrées</Text>
                </TouchableOpacity>
            </View>

            <MapView
                key={acceptedOrder ? acceptedOrder.id : 'default'}
                style={styles.map}
                region={{
                    latitude: acceptedOrder?.restaurantLocation?.latitude || currentLocation?.latitude,
                    longitude: acceptedOrder?.restaurantLocation?.longitude || currentLocation?.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }
                }
            >
                {acceptedOrder && (
                    <>
                        <Marker
                            coordinate={acceptedOrder.restaurantLocation}
                            title={`Restaurant: ${acceptedOrder.restaurant}`}
                            description={`Adresse: ${acceptedOrder.restaurantAddress}`}
                            pinColor="green"
                        />
                        <Marker
                            coordinate={acceptedOrder.clientLocation}
                            title="Adresse client"
                            description={`Adresse: ${acceptedOrder.clientAddress}`}
                            pinColor="red"
                        />
                    </>
                )}
                {currentLocation && (
                    <Marker coordinate={currentLocation} title="Votre position" pinColor="blue" />
                )}
            </MapView>

            <View style={styles.ordersContainer}>
                {tab === 'disponibles' && (
                    <>
                        {isAvailable ? (
                            <>
                                <Text style={styles.ordersTitle}>Commandes disponibles</Text>
                                <FlatList
                                    data={availableOrders}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <View style={styles.orderCard}>
                                            <Text style={styles.orderText}>
                                                <Text style={styles.orderLabel}>Restaurant : </Text>
                                                {item.restaurant}
                                            </Text>
                                            <Text style={styles.orderText}>
                                                <Text style={styles.orderLabel}>Adresse : </Text>
                                                {item.restaurantAddress}
                                            </Text>
                                            <Text style={styles.orderText}>
                                                <Text style={styles.orderLabel}>Gain : </Text>
                                                {item.price} €
                                            </Text>
                                            <TouchableOpacity
                                                style={styles.acceptButton}
                                                onPress={() => handleAcceptOrder(item)}
                                            >
                                                <Text style={styles.acceptButtonText}>Accepter</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                            </>
                        ) : (
                            <View style={styles.unavailableContainer}>
                                <Text style={styles.unavailableText}>
                                    Pour voir les commandes disponibles, veuillez mettre à jour votre statut.
                                </Text>
                            </View>
                        )}
                    </>
                )}

                {tab === 'enCours' && acceptedOrder && (
                    <>
                        <Text style={styles.ordersTitle}>Commande en cours</Text>
                        <View style={styles.orderCard}>
                            <Text style={styles.orderText}>
                                <Text style={styles.orderLabel}>Restaurant : </Text>
                                {acceptedOrder.restaurant}
                            </Text>
                            <Text style={styles.orderText}>
                                <Text style={styles.orderLabel}>Adresse du restaurant : </Text>
                                {acceptedOrder.restaurantAddress}
                            </Text>
                            <Text style={styles.orderText}>
                                <Text style={styles.orderLabel}>Adresse client : </Text>
                                {acceptedOrder.clientAddress}
                            </Text>
                            <Text style={styles.orderText}>
                                <Text style={styles.orderLabel}>Gain : </Text>
                                {acceptedOrder.price} €
                            </Text>
                            <TouchableOpacity
                                style={styles.deliveredButton}
                                onPress={handleDeliveredOrder}
                            >
                                <Text style={styles.deliveredButtonText}>Livré</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {tab === 'livrees' && (
                    <>
                        <Text style={styles.ordersTitle}>Commandes livrées</Text>
                        <FlatList
                            data={deliveredOrders}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.orderCard}>
                                    <Text style={styles.orderText}>
                                        <Text style={styles.orderLabel}>Restaurant : </Text>
                                        {item.restaurant}
                                    </Text>
                                    <Text style={styles.orderText}>
                                        <Text style={styles.orderLabel}>Adresse client : </Text>
                                        {item.clientAddress}
                                    </Text>
                                    <Text style={styles.orderText}>
                                        <Text style={styles.orderLabel}>Gain : </Text>
                                        {item.price} €
                                    </Text>
                                </View>
                            )}
                        />
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    menuButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
    },
    menuText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
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
    toggleButton: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        backgroundColor: colors[10],
        borderRadius: 5,
    },
    toggleButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#F8F9FA',
    },
    tabButton: {
        paddingVertical: 10,
        flex: 1,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: colors[7],
    },
    tabText: {
        fontSize: 16,
        color: '#666666',
    },
    activeTabText: {
        color: colors[7],
        fontWeight: 'bold',
    },
    map: {
        flex: 1.5,
    },
    ordersContainer: {
        flex: 2,
        padding: 15,
    },
    orderInfo: {
        marginBottom: 10,
    },
    ordersTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333333',
    },
    orderCard: {
        padding: 15,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    orderText: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 5,
    },
    orderLabel: {
        fontWeight: 'bold',
    },
    acceptButton: {
        backgroundColor: colors[4],
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignSelf: 'flex-end',
    },
    acceptButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    deliveredButton: {
        backgroundColor: colors[10],
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignSelf: 'flex-end',
    },
    deliveredButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    unavailableContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    unavailableText: {
        fontSize: 16,
        color: colors[7],
        textAlign: 'center',
        fontWeight: 'bold',
    },

});

export default HomeScreen;
