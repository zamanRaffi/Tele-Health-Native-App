export type UserRole = 'patient' | 'doctor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  specialization?: string;
  experience?: number;
  rating?: number;
  availableSlots?: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  patientName: string;
  date: string;
  time: string;
  type: 'video' | 'offline';
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
}

export interface LabResult {
  id: string;
  testName: string;
  date: string;
  result: string;
  normalRange: string;
  status: 'normal' | 'abnormal';
  doctorName: string;
}

export interface HealthRecord {
  id: string;
  date: string;
  title: string;
  description: string;
  doctorName: string;
  files?: string[];
}

export interface HealthMetric {
  id: string;
  type: 'weight' | 'bloodPressure' | 'heartRate' | 'glucose';
  value: string;
  date: string;
  unit: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  avatar: string;
  available: boolean;
  nextAvailable?: string;
  consultationFee: number;
}
