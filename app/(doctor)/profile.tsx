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
  import { Feather } from '@expo/vector-icons';
  import { useApp } from '../../context/AppContext';
  import Colors from '../../constants/colors';
import React from 'react';
  
  export default function DoctorProfile() {
    const router = useRouter();
    const { user, logout } = useApp();
  
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
  
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: 'Profile',
            headerStyle: {
              backgroundColor: Colors.light.background,
            },
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: '700' as const,
            },
          }}
        />
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Image source={{ uri: user?.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.role}>{user?.specialization}</Text>
            {user?.rating && user.rating > 0 && (
              <View style={styles.ratingRow}>
                <Feather name="star" size={16} color="#F59E0B" />
                <Text style={styles.rating}>
                  {user.rating} ({user.experience}+ years experience)
                </Text>
              </View>
            )}
          </View>
  
          <View style={styles.section}>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Feather name="award" size={24} color={Colors.light.primary} />
                </View>
                <Text style={styles.statValue}>{user?.experience || 0}</Text>
                <Text style={styles.statLabel}>Years Exp</Text>
              </View>
  
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Feather name="star" size={24} color="#F59E0B" />
                </View>
                <Text style={styles.statValue}>{user?.rating?.toFixed(1) || '0.0'}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
          </View>
  
          <View style={styles.section}>
            <View style={styles.infoCard}>
              {user?.specialization && (
                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Feather name="activity" size={20} color={Colors.light.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Specialization</Text>
                    <Text style={styles.infoValue}>{user.specialization}</Text>
                  </View>
                </View>
              )}
  
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Feather name="mail" size={20} color={Colors.light.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{user?.email}</Text>
                </View>
              </View>
  
              {user?.phone && (
                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Feather name="phone" size={20} color={Colors.light.primary} />
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
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Feather name="log-out" size={20} color={Colors.light.error} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.light.background,
    },
    header: {
      alignItems: 'center',
      paddingVertical: 32,
      paddingHorizontal: 24,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 16,
    },
    name: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: Colors.light.text,
      marginBottom: 4,
    },
    role: {
      fontSize: 16,
      color: Colors.light.primary,
      fontWeight: '600' as const,
      marginBottom: 8,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    rating: {
      fontSize: 14,
      color: Colors.light.textSecondary,
    },
    section: {
      paddingHorizontal: 24,
      marginBottom: 24,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: Colors.light.card,
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.light.border,
    },
    statIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#E0F2FE',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    statValue: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: Colors.light.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: Colors.light.textSecondary,
    },
    infoCard: {
      backgroundColor: Colors.light.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: Colors.light.border,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    infoIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#E0F2FE',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 12,
      color: Colors.light.textSecondary,
      marginBottom: 4,
    },
    infoValue: {
      fontSize: 16,
      fontWeight: '500' as const,
      color: Colors.light.text,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      backgroundColor: '#FEE2E2',
      paddingVertical: 16,
      borderRadius: 12,
    },
    logoutText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: Colors.light.error,
    },
  });
  