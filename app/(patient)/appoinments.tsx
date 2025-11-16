import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import Colors from '../../constants/colors';

interface Appointment {
  id: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  time: string;
  type: 'video' | 'offline';
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  callLink?: string; 
}

export default function PatientAppointments() {
  const { appointments, cancelAppointment } = useApp();

  const upcoming: Appointment[] = appointments.filter((apt) => apt.status === 'upcoming');
  const past: Appointment[] = appointments.filter((apt) => apt.status === 'completed');
  const cancelled: Appointment[] = appointments.filter((apt) => apt.status === 'cancelled');

  // Function to join video call
  const joinCall = (appointment: Appointment) => {
    if (!appointment.callLink) {
      Alert.alert('No Link', 'No video call link available for this appointment.');
      return;
    }
    Linking.openURL(appointment.callLink).catch(() => {
      Alert.alert('Error', 'Failed to open video call.');
    });
  };

  const renderAppointment = (appointment: Appointment, showActions: boolean = false) => (
    <View key={appointment.id} style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <View style={styles.iconContainer}>
          <Feather name="calendar" size={20} color={Colors.light.primary} />
        </View>
        <View style={styles.appointmentInfo}>
          <Text style={styles.doctorName}>{appointment.doctorName}</Text>
          <Text style={styles.specialization}>{appointment.doctorSpecialization}</Text>
        </View>
        <View
          style={[
            styles.typeBadge,
            appointment.type === 'video' ? styles.videoBadge : styles.offlineBadge,
          ]}
        >
          {appointment.type === 'video' ? (
            <Feather name="video" size={14} color="#1E40AF" />
          ) : (
            <Feather name="map-pin" size={14} color="#92400E" />
          )}
        </View>
      </View>

      <View style={styles.dateTimeRow}>
        <Feather name="clock" size={16} color={Colors.light.textSecondary} />
        <Text style={styles.dateTimeText}>
          {appointment.date} • {appointment.time}
        </Text>
      </View>

      {appointment.notes && <Text style={styles.notes}>{appointment.notes}</Text>}

      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => cancelAppointment(appointment.id)}
          >
            <Feather name="x" size={16} color={Colors.light.error} />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          {appointment.type === 'video' && (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => joinCall(appointment)}
            >
              <Feather name="video" size={16} color="#FFFFFF" />
              <Text style={styles.joinButtonText}>Join Call</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  const renderSection = (title: string, data: Appointment[], showActions: boolean = false) =>
    data.length > 0 ? (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {data.map((apt) => renderAppointment(apt, showActions))}
      </View>
    ) : null;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'My Appointments',
          headerStyle: { backgroundColor: Colors.light.background },
          headerTitleStyle: { fontSize: 20, fontWeight: '700' as const },
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {renderSection('Upcoming', upcoming, true)}
        {renderSection('Past Appointments', past)}
        {renderSection('Cancelled', cancelled)}

        {appointments.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="calendar" size={48} color={Colors.light.textSecondary} />
            <Text style={styles.emptyText}>No appointments yet</Text>
            <Text style={styles.emptySubtext}>
              Book your first appointment with a doctor
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  appointmentCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  specialization: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  typeBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoBadge: { backgroundColor: '#DBEAFE' },
  offlineBadge: { backgroundColor: '#FEF3C7' },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dateTimeText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  notes: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontStyle: 'italic' as const,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    gap: 6,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.error,
  },
  joinButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.light.primary,
    gap: 6,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
