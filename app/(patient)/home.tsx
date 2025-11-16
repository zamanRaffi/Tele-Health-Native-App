import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { mockDoctors } from '../../mocks/doctors';
import Colors from '../../constants/colors';

export default function PatientHome() {
  const router = useRouter();
  const { user, appointments } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDoctors = mockDoctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingAppointments = appointments
    .filter((apt) => apt.status === 'upcoming')
    .slice(0, 2);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'Guest'}!</Text>
            <Text style={styles.subtitle}>How can we help you today?</Text>
          </View>
        </View>

        {upcomingAppointments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            {upcomingAppointments.map((appointment) => (
              <TouchableOpacity
                key={appointment.id}
                style={styles.appointmentCard}
                onPress={() => router.push('/appoinments')}

              >
                <View style={styles.appointmentHeader}>
                  <View style={styles.appointmentIconContainer}>
                    <MaterialIcons
                      name="schedule"
                      size={20}
                      color={Colors.light.primary}
                    />
                  </View>
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.appointmentDoctor}>
                      {appointment.doctorName}
                    </Text>
                    <Text style={styles.appointmentSpec}>
                      {appointment.doctorSpecialization}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.typeBadge,
                      appointment.type === 'video'
                        ? styles.typeBadgeVideo
                        : styles.typeBadgeOffline,
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeBadgeText,
                        appointment.type === 'video'
                          ? styles.typeBadgeTextVideo
                          : styles.typeBadgeTextOffline,
                      ]}
                    >
                      {appointment.type === 'video' ? 'Video' : 'In-Person'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.appointmentDateTime}>
                  {appointment.date} • {appointment.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Find a Doctor</Text>
          <View style={styles.searchContainer}>
            <Feather
              name="search"
              size={20}
              color={Colors.light.textSecondary}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or specialization..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.light.textSecondary}
            />
          </View>

          <View style={styles.doctorsList}>
            {filteredDoctors.map((doctor) => (
              <TouchableOpacity
                key={doctor.id}
                style={styles.doctorCard}
                onPress={() => {
                  router.push({
                    pathname: '/book-appointment',
                    params: { doctorId: doctor.id },
                  });
                }}
              >
                <Image source={{ uri: doctor.avatar }} style={styles.doctorAvatar} />
                <View style={styles.doctorInfo}>
                  <View style={styles.doctorNameRow}>
                    <Text style={styles.doctorName}>{doctor.name}</Text>
                    {doctor.available && (
                      <View style={styles.availableBadge}>
                        <View style={styles.availableDot} />
                        <Text style={styles.availableText}>Available</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.doctorSpec}>{doctor.specialization}</Text>
                  <View style={styles.doctorMeta}>
                    <View style={styles.metaItem}>
                      <Feather
                        name="star"
                        size={14}
                        color="#F59E0B"
                      />
                      <Text style={styles.metaText}>
                        {doctor.rating} • {doctor.experience}y exp
                      </Text>
                    </View>
                  </View>
                  {doctor.nextAvailable && (
                    <View style={styles.nextAvailable}>
                      <MaterialIcons
                        name="schedule"
                        size={14}
                        color={Colors.light.primary}
                      />
                      <Text style={styles.nextAvailableText}>
                        {doctor.nextAvailable}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.doctorActions}>
                  <Text style={styles.consultationFee}>${doctor.consultationFee}</Text>
                  <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => {
                      router.push({
                        pathname: '/book-appointment',
                        params: { doctorId: doctor.id },
                      });
                    }}
                  >
                    <Text style={styles.bookButtonText}>Book</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

// Styles remain the same as your original code
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    padding: 24,
    paddingTop: 8,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  appointmentCard: {
    backgroundColor: '#E0F2FE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  appointmentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentDoctor: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  appointmentSpec: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  typeBadgeVideo: {
    backgroundColor: '#DBEAFE',
  },
  typeBadgeOffline: {
    backgroundColor: '#FEF3C7',
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  typeBadgeTextVideo: {
    color: '#1E40AF',
  },
  typeBadgeTextOffline: {
    color: '#92400E',
  },
  appointmentDateTime: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500' as const,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    paddingVertical: 12,
    marginLeft: 12,
  },
  doctorsList: {
    gap: 16,
  },
  doctorCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  doctorAvatar: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  availableText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#047857',
  },
  doctorSpec: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  doctorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  nextAvailable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nextAvailableText: {
    fontSize: 13,
    color: Colors.light.primary,
    fontWeight: '500' as const,
  },
  doctorActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  consultationFee: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  bookButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
