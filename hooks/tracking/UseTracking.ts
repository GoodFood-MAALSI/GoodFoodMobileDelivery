import { useState, useRef } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { useUser } from '../../Context/UserContext';
import useRefreshToken from '../UseRefreshToken';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_APP_API_URL;

const useTracking = (livreurId: any) => {
    const [location, setLocation] = useState<any>(null);
    const { user, tokenExpires } = useUser();
    const { refreshAccessToken } = useRefreshToken();

    const isTokenExpired = () => {
        if (!tokenExpires) return true;
        return Date.now() >= tokenExpires;
    };

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const createTrackingEntry = async (orderId: any) => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission refusée', 'Impossible d’accéder à votre position.');
            return;
        }

        const { coords } = await Location.getCurrentPositionAsync();
        setLocation(coords);

        const trackingData = {
            livreurId,
            livreurName: 'Jacob',
            location: {
                type: 'Point',
                coordinates: [coords.longitude, coords.latitude],
            },
            speedKmh: 25.5,
            timestamp: new Date().toISOString(),
            deliveryId: orderId,
        };

        console.log('Tracking data to be sent:', trackingData);

        if (isTokenExpired()) {
            const refreshSuccess = await refreshAccessToken();
            if (!refreshSuccess) {
                console.error('Token refresh failed');
                return;
            }
        }

        const token = await AsyncStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch(`${API_URL}${process.env.EXPO_PUBLIC_DELIVERY_API}/tracking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(trackingData),
            });

            if (!response.ok) {
                console.error('Failed to send tracking data');
                return;
            }

            console.log('Tracking entry created:', trackingData);
        } catch (error) {
            console.error('Error creating tracking entry:', error);
        }
    };

    const updateTracking = async (orderId: any) => {
        const { coords } = await Location.getCurrentPositionAsync();
        setLocation(coords);

        const trackingData = {
            livreurId,
            livreurName: 'Jacob',
            location: {
                type: 'Point',
                coordinates: [coords.longitude, coords.latitude],
            },
            speedKmh: 25.5,
            timestamp: new Date().toISOString(),
            deliveryId: orderId,
        };
        console.log('Tracking data to be sent:', trackingData);

        const token = await AsyncStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch(`${API_URL}${process.env.EXPO_PUBLIC_DELIVERY_API}/tracking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(trackingData),
            });

            if (!response.ok) {
                console.error('Failed to update tracking data');
                return;
            }

            console.log('Tracking updated:', trackingData);
        } catch (error) {
            console.error('Error updating tracking data:', error);
        }
    };

    const startTracking = (orderId: any) => {
        console.log('Starting tracking...');

        createTrackingEntry(orderId);

        intervalRef.current = setInterval(() => {
            updateTracking(orderId);
        }, 30000);
    };

    const stopTracking = () => {
        console.log('Stopping tracking...');
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    return { location, startTracking, stopTracking };
};

export default useTracking;
