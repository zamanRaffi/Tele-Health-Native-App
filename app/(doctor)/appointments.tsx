import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import Colors from '../../constants/colors';

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  patientName: string;
  date: string;
  time: string;
  type: 'video' | 'offline';
  status: 'upcoming' | 'completed';
  notes?: string;
}

export default function DoctorAppointments() {
  const { appointments, user } = useApp();

  // Filter appointments for the logged-in doctor
  const upcoming: Appointment[] = appointments
    .filter((apt) => apt.status === 'upcoming' && apt.doctorId === user?.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const past: Appointment[] = appointments
    .filter((apt) => apt.status === 'completed' && apt.doctorId === user?.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const renderAppointment = (appointment: Appointment) => (
    <View key={appointment.id} style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <View style={styles.iconContainer}>
          <Feather name="user" size={20} color={Colors.light.primary} />
        </View>
        <View style={styles.appointmentInfo}>
          <Text style={styles.patientName}>{appointment.patientName}</Text>
          <View style={styles.dateTimeRow}>
            <Feather name="clock" size={14} color={Colors.light.textSecondary} />
            <Text style={styles.dateTimeText}>
              {appointment.date} • {appointment.time}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.typeBadge,
            appointment.type === 'video' ? styles.videoBadge : styles.offlineBadge,
          ]}
        >
          {appointment.type === 'video' ? (
            <Feather name="video" size={16} color="#1E40AF" />
          ) : (
            <Feather name="map-pin" size={16} color="#92400E" />
          )}
        </View>
      </View>

      {appointment.notes && (
        <Text style={styles.notes}>{appointment.notes}</Text>
      )}

      {appointment.status === 'upcoming' && appointment.type === 'video' && (
        <TouchableOpacity style={styles.joinButton}>
          <Feather name="video" size={16} color="#FFFFFF" />
          <Text style={styles.joinButtonText}>Join Video Call</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'My Appointments',
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
          <Text style={styles.greeting}>
            Welcome, Dr. {user?.name}
          </Text>
          <Text style={styles.subtitle}>
            You have {upcoming.length} upcoming appointment{upcoming.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {upcoming.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            {upcoming.map(renderAppointment)}
          </View>
        )}

        {past.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Past Appointments</Text>
            {past.map(renderAppointment)}
          </View>
        )}

        {appointments.filter((apt) => apt.doctorId === user?.id).length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="calendar" size={48} color={Colors.light.textSecondary} />
            <Text style={styles.emptyText}>No appointments scheduled</Text>
            <Text style={styles.emptySubtext}>
              Your appointments will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: { padding: 24, paddingBottom: 16 },
  greeting: { fontSize: 24, fontWeight: '700' as const, color: Colors.light.text, marginBottom: 4 },
  subtitle: { fontSize: 16, color: Colors.light.textSecondary },
  section: { padding: 24, paddingTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700' as const, color: Colors.light.text, marginBottom: 16 },
  appointmentCard: { backgroundColor: Colors.light.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.light.border },
  appointmentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  appointmentInfo: { flex: 1 },
  patientName: { fontSize: 16, fontWeight: '600' as const, color: Colors.light.text, marginBottom: 4 },
  dateTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateTimeText: { fontSize: 14, color: Colors.light.textSecondary },
  typeBadge: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  videoBadge: { backgroundColor: '#DBEAFE' },
  offlineBadge: { backgroundColor: '#FEF3C7' },
  notes: { fontSize: 14, color: Colors.light.textSecondary, fontStyle: 'italic' as const, marginBottom: 12 },
  joinButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10, backgroundColor: Colors.light.primary, gap: 6, marginTop: 8 },
  joinButtonText: { fontSize: 14, fontWeight: '600' as const, color: '#FFFFFF' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 80, paddingHorizontal: 40 },
  emptyText: { fontSize: 18, fontWeight: '600' as const, color: Colors.light.text, marginTop: 16, marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: Colors.light.textSecondary, textAlign: 'center' },
});
