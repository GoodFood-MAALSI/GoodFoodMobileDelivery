import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../assets/styles/ProfilStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const handleEditProfile = () => {
    console.log("Modifier le profil");
  };

  const handleLogout = () => {
    console.log("Déconnexion");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mon Profil</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nom :</Text>
        <Text style={styles.value}>Maxence Crespel</Text>

        <Text style={styles.label}>Email :</Text>
        <Text style={styles.value}>maxence@example.com</Text>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Text style={styles.buttonText}>Modifier le profil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Se déconnecter</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
