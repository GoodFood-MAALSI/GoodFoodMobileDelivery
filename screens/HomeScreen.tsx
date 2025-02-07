import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import CustomButton from '../components/CustomButton';
import CustomTabs from '../components/CustomTabs';
import CustomCard from '../components/CustomCard';
import theme from '../assets/styles/themes';

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

    const handleCancelOrder = () => {
        if (!acceptedOrder) return;

        Alert.alert(
            "Annulation",
            "Êtes-vous sûr de vouloir annuler cette commande ?",
            [
                {
                    text: "Non",
                    style: "cancel",
                },
                {
                    text: "Oui",
                    onPress: () => {
                        setAvailableOrders((prevOrders) => [...prevOrders, acceptedOrder]);
                        setAcceptedOrder(null);
                        Alert.alert("Commande annulée", "Vous pouvez accepter une nouvelle commande.");
                        setTab("disponibles");
                    },
                },
            ]
        );
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
                <CustomButton
                    text={isAvailable ? 'Se rendre indisponible' : 'Se rendre disponible'}
                    onPress={handleToggleAvailability}
                    backgroundColor={isAvailable ? theme.colors.danger : theme.colors.success}
                    size='small'
                />
            </View>

            <CustomTabs
                tabs={[
                    { key: 'disponibles', label: 'Commandes disponibles' },
                    { key: 'enCours', label: 'Commande en cours' },
                    { key: 'livrees', label: 'Commandes livrées' }
                ]}
                activeTab={tab}
                onTabChange={setTab}
            />

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
                                        <CustomCard
                                            title={item.restaurant}
                                            details={[
                                                { label: 'Adresse du restaurant', value: item.restaurantAddress },
                                                { label: 'Adresse client', value: item.clientAddress },
                                                { label: 'Gain', value: `${item.price} €` },
                                            ]}
                                            buttons={[
                                                { text: 'Accepter', onPress: () => handleAcceptOrder(item), backgroundColor: theme.colors.success },
                                            ]}
                                        />
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
                        <CustomCard
                            title={acceptedOrder.restaurant}
                            details={[
                                { label: 'Adresse du restaurant', value: acceptedOrder.restaurantAddress },
                                { label: 'Adresse client', value: acceptedOrder.clientAddress },
                                { label: 'Gain', value: `${acceptedOrder.price} €` },
                            ]}
                            buttons={[
                                { text: 'Livré', onPress: handleDeliveredOrder, backgroundColor: theme.colors.primary },
                                { text: 'Annulé', onPress: handleCancelOrder, backgroundColor: theme.colors.danger }
                            ]}
                        />
                    </>
                )}

                {tab === 'livrees' && (
                    <>
                        <Text style={styles.ordersTitle}>Commandes livrées</Text>
                        <FlatList
                            data={deliveredOrders}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <CustomCard
                                    title={item.restaurant}
                                    details={[
                                        { label: 'Adresse client', value: item.clientAddress },
                                        { label: 'Gain', value: `${item.price} €` },
                                    ]}
                                    buttons={[]}
                                />
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

});

export default HomeScreen;
