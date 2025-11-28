import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import Colors from '../../constants/colors';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PatientProfile() {
  const router = useRouter();
  const { user, logout } = useApp();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved avatar from AsyncStorage
    (async () => {
      try {
        const savedAvatar = await AsyncStorage.getItem('patientAvatar');
        if (savedAvatar) setAvatar(savedAvatar);
      } catch (err) {
        console.log('Error loading avatar:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission denied',
          'You need to allow photo access to update your profile.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      // Updated for Expo SDK 49+
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri;
        setAvatar(selectedImageUri);
        await AsyncStorage.setItem('patientAvatar', selectedImageUri);
      }
    } catch (err) {
      console.log('ImagePicker error:', err);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 50 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Profile',
          headerStyle: { backgroundColor: Colors.light.background },
          headerTitleStyle: { fontSize: 20, fontWeight: '700' as const },
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{
                uri: avatar || 'https://via.placeholder.com/100',
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.role}>Patient</Text>
          <Text style={styles.editText}>Tap image to update</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialIcons
                  name="mail"
                  size={20}
                  color={Colors.light.primary}
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>
            </View>

            {user?.phone && (
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Feather
                    name="phone"
                    size={20}
                    color={Colors.light.primary}
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{user.phone}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Feather name="log-out" size={20} color={Colors.light.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background,paddingVertical: 90,},
  header: { alignItems: 'center', paddingHorizontal: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 8 },
  name: { fontSize: 24, fontWeight: '700' as const, color: Colors.light.text, marginBottom: 4 },
  role: { fontSize: 16, color: Colors.light.textSecondary },
  editText: { fontSize: 12, color: Colors.light.primary, marginTop: 4 },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  infoCard: { backgroundColor: Colors.light.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.light.border },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  infoIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, color: Colors.light.textSecondary, marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: '500' as const, color: Colors.light.text },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: '#FEE2E2', paddingVertical: 16, borderRadius: 12 },
  logoutText: { fontSize: 16, fontWeight: '600' as const, color: Colors.light.error },
});
