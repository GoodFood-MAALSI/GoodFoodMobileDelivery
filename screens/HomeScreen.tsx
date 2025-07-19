import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, TextInput, Modal, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import CustomButton from '../components/CustomButton';
import CustomTabs from '../components/CustomTabs';
import CustomCard from '../components/CustomCard';
import theme from '../assets/styles/themes';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../assets/styles/HomeStyles';
import { useAvailableOrders, useOrders } from '../hooks/orders/UseOrders';
import { useUpdateOrderStatus } from '../hooks/orders/UseUpdateOrderStatus';
import { useUser } from '../Context/UserContext';
import { useCreateDelivery } from '../hooks/orders/UseCreateDelivery';
import { useVerifyDeliveryCode } from '../hooks/orders/UseVerifyCode';

// Fonction pour calculer la distance en km entre deux points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Rayon de la Terre en kilomètres
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Conversion en radians
    const dLon = (lon2 - lon1) * (Math.PI / 180); // Conversion en radians

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance en kilomètres

    return distance; // Retourne la distance en kilomètres
};

const HomeScreen = ({ navigation }: any) => {
    const [isAvailable, setIsAvailable] = useState(true);
    const [currentLocation, setCurrentLocation] = useState<any>(null);
    const [tab, setTab] = useState<'Disponibles' | 'enCours' | 'enLivraison' | 'Livrees'>('Disponibles');
    const [code, setCode] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(false);

    const { user } = useUser();
    const delivererId = user?.id;
    const { updateOrderStatus } = useUpdateOrderStatus();
    const { createDelivery } = useCreateDelivery();
    const { verifyDeliveryCode, result } = useVerifyDeliveryCode();

    const { orders: availableOrders, refetch: refetchAvailableOrders } = useAvailableOrders(
        50.6357,
        3.0601,
        10000,
        1,
        10
    );

    const { orders: acceptedOrders, refetch: refetchAcceptedOrders } = useOrders(
        delivererId,
        3,
        1,
        10
    );

    const { orders: orderToDeliver, refetch: refetchOrderToDeliver } = useOrders(
        delivererId,
        4,
        1,
        10
    );

    const { orders: deliveredOrders, refetch: refetchDeliveredOrders } = useOrders(
        delivererId,
        5,
        1,
        10
    );

    useEffect(() => {
        (async () => {
            let { status } = await Location?.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert?.alert('Permission refusée', 'Impossible d’accéder à votre position.');
                return;
            }
            let location = await Location?.getCurrentPositionAsync({});
            setCurrentLocation(location?.coords);
        })();
    }, []);

    const handleAcceptOrder = async (order: any) => {
        if (acceptedOrders.length > 0 || orderToDeliver.length > 0) {
            Alert.alert(
                'Action impossible',
                "Vous avez une commande en cours. Veuillez terminer la commande avant d'en commencer une nouvelle."
            );
            return;
        }
        await createDelivery(order?.id, 1, 1);
        Alert.alert('Commande acceptée', `Vous avez accepté la commande de ${order?.client?.first_name} ${order?.client?.last_name} au restaurant: ${order?.restaurant?.name}.`);
        setTab('enCours');

        refetchAcceptedOrders();
        refetchAvailableOrders();
    };

    const handleGetOrder = async (order: any) => {
        if (acceptedOrders.length > 0) {
            await updateOrderStatus(order?.id, 4);
            Alert.alert('Commande récupérée', 'Vous pouvez maintenant la livrer au client.');
            setTab('enLivraison');

            refetchAcceptedOrders();
            refetchOrderToDeliver();
        }
    };

    const handleDeliveredOrder = async (order: any) => {
        if (orderToDeliver.length > 0) {
            setModalVisible(true);
        }
    };

    const handleModalSubmit = async () => {
        if (code) {
            await verifyDeliveryCode(orderToDeliver[0].id, code);

            if (result) {
                await updateOrderStatus(orderToDeliver[0].id, 5);
                Alert.alert('Commande livrée', 'Vous pouvez maintenant accepter une nouvelle commande.');
                setTab('Livrees');
                refetchOrderToDeliver();
                refetchDeliveredOrders();
                setModalVisible(false);
            } else {
                Alert.alert('Erreur', 'Le code de vérification est incorrect.');
            }
        } else {
            Alert.alert('Erreur', 'Veuillez entrer un code de vérification valide.');
        }
    };

    const handleCancelOrder = async () => {
        if (acceptedOrders.length === 0) return;

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
                        Alert.alert("Commande annulée", "Vous pouvez accepter une nouvelle commande.");
                        setTab("Disponibles");

                        refetchAvailableOrders();
                        refetchAcceptedOrders();
                    },
                },
            ]
        );
    };

    const handleToggleAvailability = () => {
        if ((acceptedOrders.length > 0 || orderToDeliver.length > 0) && isAvailable) {
            Alert.alert(
                'Action impossible',
                'Vous avez une commande en cours. Veuillez terminer la commande avant de vous rendre indisponible.'
            );
            return;
        }
        setIsAvailable(!isAvailable);
    };

    const getDeliveryDistance = (restaurantLat: number, restaurantLon: number) => {
        if (!currentLocation) return 0;
        return calculateDistance(currentLocation.latitude, currentLocation.longitude, restaurantLat, restaurantLon);
    };

    const getRestaurantToClientDistance = (restaurantLat: number, restaurantLon: number, clientLat: number, clientLon: number) => {
        return calculateDistance(restaurantLat, restaurantLon, clientLat, clientLon);
    };

    return (
        <SafeAreaView style={styles.container}>
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
                    { key: 'Disponibles', label: 'Commandes disponibles' },
                    { key: 'enCours', label: 'Commande en préparation' },
                    { key: 'enLivraison', label: 'Commande à livrer' },
                    { key: 'Livrees', label: 'Commandes livrées' }
                ]}
                activeTab={tab}
                onTabChange={setTab}
            />

            <MapView
                key={acceptedOrders ? acceptedOrders : 'default'}
                style={styles.map}
                region={{
                    latitude: (acceptedOrders && acceptedOrders[0]?.restaurant?.lat) || (orderToDeliver && orderToDeliver[0]?.lat) || currentLocation?.latitude || 50.6357,
                    longitude: (acceptedOrders && acceptedOrders[0]?.restaurant?.long) || (orderToDeliver && orderToDeliver[0]?.long) || currentLocation?.longitude || 3.0601,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                {currentLocation && (
                    <Marker coordinate={currentLocation} title="Votre position" pinColor="blue" />
                )}

                {acceptedOrders && acceptedOrders.map((order) => {
                    const restaurantLocation = {
                        latitude: parseFloat(order?.restaurant?.lat),
                        longitude: parseFloat(order?.restaurant?.long),
                    };
                    const distance = getDeliveryDistance(restaurantLocation.latitude, restaurantLocation.longitude);
                    return (
                        <Marker
                            key={order?.restaurant_id + '_restaurant'}
                            coordinate={restaurantLocation}
                            title="Adresse restaurant"
                            description={`Adresse: ${order?.restaurant?.street_number} ${order?.restaurant?.street}, ${order?.restaurant?.city} ${order?.restaurant?.postal_code}, ${order?.restaurant?.country} | Distance: ${distance.toFixed(2)} km`}
                            pinColor="green"
                        />
                    );
                })}

                {orderToDeliver && orderToDeliver.map((order) => {
                    const clientLocation = {
                        latitude: parseFloat(order.lat),
                        longitude: parseFloat(order.long),
                    };
                    const distance = getRestaurantToClientDistance(parseFloat(order?.restaurant?.lat), parseFloat(order?.restaurant?.long), clientLocation.latitude, clientLocation.longitude);
                    return (
                        <Marker
                            key={order.client_id + '_client'}
                            coordinate={clientLocation}
                            title="Adresse client"
                            description={`Adresse: ${order.street_number} ${order.street}, ${order.city} ${order.postal_code}, ${order.country} | Distance: ${distance.toFixed(2)} km`}
                            pinColor="red"
                        />
                    );
                })}
            </MapView>

            <View style={styles.ordersContainer}>
                {tab === 'Disponibles' && isAvailable && (
                    <>
                        <Text style={styles.ordersTitle}>Commandes disponibles</Text>
                        <FlatList
                            data={availableOrders}
                            keyExtractor={(item) => item?.id.toString()}
                            renderItem={({ item }) => {
                                const restaurantAddress = `${item?.restaurant?.street_number} ${item?.restaurant?.street}, ${item?.restaurant?.city} ${item?.restaurant?.postal_code}, ${item?.restaurant?.country}`;
                                const clientAddress = `${item?.street_number} ${item?.street}, ${item?.city} ${item?.postal_code}, ${item?.country}`;
                                const restaurantLocation = {
                                    latitude: parseFloat(item?.restaurant?.lat),
                                    longitude: parseFloat(item?.restaurant?.long),
                                };
                                const clientLocation = {
                                    latitude: parseFloat(item?.lat),
                                    longitude: parseFloat(item?.long),
                                };
                                const restaurantDistance = getDeliveryDistance(restaurantLocation.latitude, restaurantLocation.longitude);
                                const clientDistance = getRestaurantToClientDistance(restaurantLocation.latitude, restaurantLocation.longitude, clientLocation.latitude, clientLocation.longitude);
                                return (
                                    <CustomCard
                                        title={item?.restaurant?.name}
                                        details={[
                                            {
                                                label: 'Adresse du restaurant',
                                                value: `${restaurantAddress} | ${restaurantDistance.toFixed(2)} km`
                                            },
                                            {
                                                label: 'Adresse client',
                                                value: `${clientAddress} | ${clientDistance.toFixed(2)} km`
                                            },
                                            {
                                                label: 'Gain',
                                                value: `${item?.delivery_costs} €`
                                            },
                                        ]}
                                        buttons={[
                                            {
                                                text: 'Accepter',
                                                onPress: () => handleAcceptOrder(item),
                                                backgroundColor: theme.colors.success,
                                            },
                                        ]}
                                    />
                                );
                            }}
                        />
                    </>
                )}
                {tab === 'enCours' && acceptedOrders && (
                    <>
                        <Text style={styles.ordersTitle}>Commande en cours</Text>
                        <FlatList
                            data={acceptedOrders}
                            keyExtractor={(item) => item?.id.toString()}
                            renderItem={({ item }) => {
                                const restaurantAddress = `${item?.restaurant?.street_number} ${item?.restaurant?.street}, ${item?.restaurant?.city} ${item?.restaurant?.postal_code}, ${item?.restaurant?.country}`;
                                const clientAddress = `${item?.street_number} ${item?.street}, ${item?.city} ${item?.postal_code}, ${item?.country}`;
                                const restaurantLocation = {
                                    latitude: parseFloat(item?.restaurant?.lat),
                                    longitude: parseFloat(item?.restaurant?.long),
                                };
                                const clientLocation = {
                                    latitude: parseFloat(item?.lat),
                                    longitude: parseFloat(item?.long),
                                };
                                const restaurantDistance = getDeliveryDistance(restaurantLocation.latitude, restaurantLocation.longitude);
                                const clientDistance = getRestaurantToClientDistance(restaurantLocation.latitude, restaurantLocation.longitude, clientLocation.latitude, clientLocation.longitude);
                                return (
                                    <CustomCard
                                        title={item?.restaurant?.name}
                                        details={[
                                            {
                                                label: 'Adresse du restaurant',
                                                value: `${restaurantAddress} | ${restaurantDistance.toFixed(2)} km`
                                            },
                                            {
                                                label: 'Adresse client',
                                                value: `${clientAddress} | ${clientDistance.toFixed(2)} km`
                                            },
                                            {
                                                label: 'Gain',
                                                value: `${item?.delivery_costs} €`
                                            },
                                        ]}
                                        buttons={[
                                            {
                                                text: 'Récupérer',
                                                onPress: () => handleGetOrder(item),
                                                backgroundColor: theme.colors.primary
                                            },
                                            {
                                                text: 'Annuler',
                                                onPress: handleCancelOrder,
                                                backgroundColor: theme.colors.danger
                                            }
                                        ]}
                                    />
                                );
                            }}
                        />
                    </>
                )}
                {tab === 'enLivraison' && orderToDeliver && (
                    <>
                        <Text style={styles.ordersTitle}>Commande à livrer</Text>
                        <FlatList
                            data={orderToDeliver}
                            keyExtractor={(item) => item?.id.toString()}
                            renderItem={({ item }) => {
                                const restaurantAddress = `${item?.restaurant?.street_number} ${item?.restaurant?.street}, ${item?.restaurant?.city} ${item?.restaurant?.postal_code}, ${item?.restaurant?.country}`;
                                const clientAddress = `${item?.street_number} ${item?.street}, ${item?.city} ${item?.postal_code}, ${item?.country}`;
                                const restaurantLocation = {
                                    latitude: parseFloat(item?.restaurant?.lat),
                                    longitude: parseFloat(item?.restaurant?.long),
                                };
                                const clientLocation = {
                                    latitude: parseFloat(item?.lat),
                                    longitude: parseFloat(item?.long),
                                };
                                const restaurantDistance = getDeliveryDistance(restaurantLocation.latitude, restaurantLocation.longitude);
                                const clientDistance = getRestaurantToClientDistance(restaurantLocation.latitude, restaurantLocation.longitude, clientLocation.latitude, clientLocation.longitude);
                                return (
                                    <CustomCard
                                        title={item?.restaurant?.name}
                                        details={[
                                            {
                                                label: 'Adresse du restaurant',
                                                value: `${restaurantAddress} | ${restaurantDistance.toFixed(2)} km`
                                            },
                                            {
                                                label: 'Adresse client',
                                                value: `${clientAddress} | ${clientDistance.toFixed(2)} km`
                                            },
                                            {
                                                label: 'Gain',
                                                value: `${item?.delivery_costs} €`
                                            },
                                        ]}
                                        buttons={[
                                            { text: 'Livrer', onPress: () => handleDeliveredOrder(item), backgroundColor: theme.colors.primary },
                                            { text: 'Annuler', onPress: handleCancelOrder, backgroundColor: theme.colors.danger }
                                        ]}
                                    />
                                );
                            }}
                        />
                    </>
                )}
                {tab === 'Livrees' && (
                    <>
                        <Text style={styles.ordersTitle}>Commandes livrées</Text>
                        <FlatList
                            data={deliveredOrders}
                            keyExtractor={(item) => item?.id.toString()}
                            renderItem={({ item }) => {
                                const restaurantAddress = `${item?.restaurant?.street_number} ${item?.restaurant?.street}, ${item?.restaurant?.city} ${item?.restaurant?.postal_code}, ${item?.restaurant?.country}`;
                                const clientAddress = `${item?.street_number} ${item?.street}, ${item?.city} ${item?.postal_code}, ${item?.country}`;

                                return (
                                    <CustomCard
                                        title={item?.restaurant?.name}
                                        details={[
                                            {
                                                label: 'Adresse du restaurant',
                                                value: restaurantAddress
                                            },
                                            {
                                                label: 'Adresse client',
                                                value: clientAddress
                                            },
                                            {
                                                label: 'Gain',
                                                value: `${item?.delivery_costs} €`
                                            },
                                        ]}
                                        buttons={[]}
                                    />
                                );
                            }}
                        />
                    </>
                )}
            </View>
            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalcontainer}>
                    <Text style={styles.modaltitle}>Entrez le code de vérification de la livraison</Text>
                    <TextInput
                        style={styles.modalinput}
                        placeholder="Code de vérification"
                        value={code}
                        onChangeText={setCode}
                    />
                    <View style={styles.modalbuttonContainer}>
                        <Button title="Valider" onPress={handleModalSubmit} color={theme.colors.success} />
                        <Button title="Annuler" onPress={() => setModalVisible(false)} color={theme.colors.danger} />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default HomeScreen;
