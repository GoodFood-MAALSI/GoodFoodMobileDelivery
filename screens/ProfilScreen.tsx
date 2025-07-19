import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../assets/styles/ProfilStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../Context/UserContext';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useUser();
  const handleEditProfile = () => {
    console.log('Modifier infos personnelles');
  };

  const handleEditProInfo = () => {
    console.log('Modifier infos professionnelles');
  };

  const handleEditVehicle = () => {
    console.log('Modifier véhicule');
  };

  const handleLogout = () => {
    logout();
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Mon Profil</Text>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Informations personnelles</Text>
            <TouchableOpacity onPress={handleEditProfile}>
              <Ionicons name="create-outline" size={20} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nom</Text>
          <Text style={styles.value}>Maxence Crespel</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>maxence@example.com</Text>

          <Text style={styles.label}>Téléphone</Text>
          <Text style={styles.value}>+33 6 12 34 56 78</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Infos professionnelles</Text>
            <TouchableOpacity onPress={handleEditProInfo}>
              <Ionicons name="create-outline" size={20} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Statut</Text>
          <Text style={styles.value}>Auto-entrepreneur</Text>

          <Text style={styles.label}>SIRET</Text>
          <Text style={styles.value}>123 456 789 00012</Text>

          <Text style={styles.label}>En activité depuis</Text>
          <Text style={styles.value}>Janvier 2024</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Véhicule</Text>
            <TouchableOpacity onPress={handleEditVehicle}>
              <Ionicons name="create-outline" size={20} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Type</Text>
          <Text style={styles.value}>Vélo</Text>

          <Text style={styles.label}>Modèle</Text>
          <Text style={styles.value}>Decathlon Riverside</Text>

          <Text style={styles.label}>Assurance</Text>
          <Text style={styles.value}>✔️ Fournie</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
