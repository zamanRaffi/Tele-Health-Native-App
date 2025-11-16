import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, UserRole, Appointment, LabResult, HealthRecord, HealthMetric } from '../types';
import { mockAppointments } from '../mocks/appointments';
import { mockLabResults, mockHealthRecords, mockHealthMetrics } from '../mocks/healthData';

const STORAGE_KEYS = {
  USER: '@telehealth_user',
  APPOINTMENTS: '@telehealth_appointments',
  HEALTH_METRICS: '@telehealth_health_metrics',
};

export const [AppContext, useApp] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [labResults] = useState<LabResult[]>(mockLabResults);
  const [healthRecords] = useState<HealthRecord[]>(mockHealthRecords);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      const storedAppointments = await AsyncStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      const storedMetrics = await AsyncStorage.getItem(STORAGE_KEYS.HEALTH_METRICS);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      } else {
        setAppointments(mockAppointments);
      }
      if (storedMetrics) {
        setHealthMetrics(JSON.parse(storedMetrics));
      } else {
        setHealthMetrics(mockHealthMetrics);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const signupData = await AsyncStorage.getItem(`@telehealth_signup_${email}`);
      
      let userToLogin: User;
      if (signupData) {
        userToLogin = JSON.parse(signupData);
      } else {
        userToLogin = {
          id: role === 'patient' ? 'patient1' : 'doctor1',
          email,
          name: role === 'patient' ? 'John Doe' : 'Dr. Sarah Johnson',
          role,
          phone: '+1 234 567 8900',
          avatar: role === 'patient' 
            ? 'https://i.pravatar.cc/150?img=12' 
            : 'https://i.pravatar.cc/150?img=1',
          ...(role === 'doctor' && {
            specialization: 'Cardiologist',
            experience: 12,
            rating: 4.8,
          }),
        };
      }

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userToLogin));
      setUser(userToLogin);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const signup = useCallback(async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    specialization?: string
  ): Promise<boolean> => {
    try {
      const newUser: User = {
        id: `${role}_${Date.now()}`,
        email,
        name,
        role,
        phone: '',
        avatar: role === 'patient' 
          ? 'https://i.pravatar.cc/150?img=12' 
          : 'https://i.pravatar.cc/150?img=1',
        ...(role === 'doctor' && {
          specialization: specialization || 'General Physician',
          experience: 0,
          rating: 0,
        }),
      };

      await AsyncStorage.setItem(`@telehealth_signup_${email}`, JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const addAppointment = useCallback(async (appointment: Appointment) => {
    try {
      const updatedAppointments = [...appointments, appointment];
      setAppointments(updatedAppointments);
      await AsyncStorage.setItem(
        STORAGE_KEYS.APPOINTMENTS,
        JSON.stringify(updatedAppointments)
      );
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  }, [appointments]);

  const cancelAppointment = useCallback(async (appointmentId: string) => {
    try {
      const updatedAppointments = appointments.map(apt =>
        apt.id === appointmentId ? { ...apt, status: 'cancelled' as const } : apt
      );
      setAppointments(updatedAppointments);
      await AsyncStorage.setItem(
        STORAGE_KEYS.APPOINTMENTS,
        JSON.stringify(updatedAppointments)
      );
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  }, [appointments]);

  const addHealthMetric = useCallback(async (metric: HealthMetric) => {
    try {
      const updatedMetrics = [...healthMetrics, metric];
      setHealthMetrics(updatedMetrics);
      await AsyncStorage.setItem(
        STORAGE_KEYS.HEALTH_METRICS,
        JSON.stringify(updatedMetrics)
      );
    } catch (error) {
      console.error('Error adding health metric:', error);
    }
  }, [healthMetrics]);

  const getUserAppointments = useCallback(() => {
    if (!user) return [];
    
    if (user.role === 'patient') {
      return appointments.filter(apt => apt.patientId === user.id);
    } else {
      return appointments.filter(apt => apt.doctorId === user.id);
    }
  }, [user, appointments]);

  return useMemo(() => ({
    user,
    isLoading,
    login,
    signup,
    logout,
    appointments: getUserAppointments(),
    allAppointments: appointments,
    labResults,
    healthRecords,
    healthMetrics,
    addAppointment,
    cancelAppointment,
    addHealthMetric,
  }), [user, isLoading, login, signup, logout, getUserAppointments, appointments, labResults, healthRecords, healthMetrics, addAppointment, cancelAppointment, addHealthMetric]);
});
