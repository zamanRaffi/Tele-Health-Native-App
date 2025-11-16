import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { mockDoctors } from '../mocks/doctors';
import Colors from '../constants/colors';
import React from 'react';

const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
];

const dates = [
  { date: '2025-01-15', day: 'Mon' },
  { date: '2025-01-16', day: 'Tue' },
  { date: '2025-01-17', day: 'Wed' },
  { date: '2025-01-18', day: 'Thu' },
  { date: '2025-01-19', day: 'Fri' },
];

export default function BookAppointment() {
  const router = useRouter();
  const { doctorId } = useLocalSearchParams<{ doctorId: string }>();
  const { user, addAppointment } = useApp();

  const doctor = mockDoctors.find((d) => d.id === doctorId);

  const [selectedDate, setSelectedDate] = useState<string>(dates[0].date);
  const [selectedTime, setSelectedTime] = useState<string>(timeSlots[0]);
  const [appointmentType, setAppointmentType] = useState<'video' | 'offline'>('video');

  if (!doctor) {
    return (
      <View style={styles.container}>
        <Text>Doctor not found</Text>
      </View>
    );
  }

  const handleBookAppointment = () => {
    if (!user) return;

    const appointment = {
      id: Date.now().toString(),
      patientId: user.id,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      patientName: user.name,
      date: selectedDate,
      time: selectedTime,
      type: appointmentType,
      status: 'upcoming' as const,
      callLink:
        appointmentType === 'video'
          ? `https://example.com/call/${Date.now()}` // Generate or fetch real link here
          : undefined,
    };

    addAppointment(appointment);
    Alert.alert('Success', 'Appointment booked successfully!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const joinCall = (callLink: string) => {
    Linking.openURL(callLink).catch(() => {
      Alert.alert('Error', 'Failed to open video call.');
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Book Appointment',
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600' as const,
          },
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.doctorCard}>
          <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.specialization}>{doctor.specialization}</Text>
            <View style={styles.metaRow}>
              <Feather name="star" size={14} color="#F59E0B" />
              <Text style={styles.metaText}>
                {doctor.rating} • {doctor.experience}y exp
              </Text>
            </View>
            <Text style={styles.fee}>${doctor.consultationFee} / session</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment Type</Text>
          <View style={styles.typeButtons}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                appointmentType === 'video' && styles.typeButtonActive,
              ]}
              onPress={() => setAppointmentType('video')}
            >
              <Feather
                name="video"
                size={20}
                color={
                  appointmentType === 'video'
                    ? Colors.light.primary
                    : Colors.light.textSecondary
                }
              />
              <Text
                style={[
                  styles.typeButtonText,
                  appointmentType === 'video' && styles.typeButtonTextActive,
                ]}
              >
                Video Call
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                appointmentType === 'offline' && styles.typeButtonActive,
              ]}
              onPress={() => setAppointmentType('offline')}
            >
              <Feather
                name="map-pin"
                size={20}
                color={
                  appointmentType === 'offline'
                    ? Colors.light.primary
                    : Colors.light.textSecondary
                }
              />
              <Text
                style={[
                  styles.typeButtonText,
                  appointmentType === 'offline' && styles.typeButtonTextActive,
                ]}
              >
                In-Person
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateScroll}
          >
            {dates.map((item) => (
              <TouchableOpacity
                key={item.date}
                style={[
                  styles.dateButton,
                  selectedDate === item.date && styles.dateButtonActive,
                ]}
                onPress={() => setSelectedDate(item.date)}
              >
                <Text
                  style={[
                    styles.dateDay,
                    selectedDate === item.date && styles.dateDayActive,
                  ]}
                >
                  {item.day}
                </Text>
                <Text
                  style={[
                    styles.dateText,
                    selectedDate === item.date && styles.dateTextActive,
                  ]}
                >
                  {new Date(item.date).getDate()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeButton,
                  selectedTime === time && styles.timeButtonActive,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Feather
                  name="clock"
                  size={16}
                  color={
                    selectedTime === time
                      ? '#FFFFFF'
                      : Colors.light.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.timeButtonText,
                    selectedTime === time && styles.timeButtonTextActive,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBookAppointment}
          >
            <Text style={styles.bookButtonText}>Confirm Booking</Text>
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
  doctorCard: {
    flexDirection: 'row',
    padding: 24,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  specialization: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  fee: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.card,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  typeButtonActive: {
    backgroundColor: '#E0F2FE',
    borderColor: Colors.light.primary,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  typeButtonTextActive: {
    color: Colors.light.primary,
  },
  dateScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  dateButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.card,
    borderWidth: 2,
    borderColor: Colors.light.border,
    marginRight: 12,
  },
  dateButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  dateDay: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  dateDayActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  dateTextActive: {
    color: '#FFFFFF',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: Colors.light.card,
    borderWidth: 2,
    borderColor: Colors.light.border,
    minWidth: '30%',
  },
  timeButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.light.textSecondary,
  },
  timeButtonTextActive: {
    color: '#FFFFFF',
  },
  bookButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
