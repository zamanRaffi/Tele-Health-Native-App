import { LabResult, HealthRecord, HealthMetric } from '../types';

export const mockLabResults: LabResult[] = [
  {
    id: '1',
    testName: 'Complete Blood Count (CBC)',
    date: '2025-01-10',
    result: 'Normal',
    normalRange: '4.5-11.0 x10^9/L',
    status: 'normal',
    doctorName: 'Dr. Sarah Johnson',
  },
  {
    id: '2',
    testName: 'Lipid Profile',
    date: '2025-01-08',
    result: 'Cholesterol: 210 mg/dL',
    normalRange: '<200 mg/dL',
    status: 'abnormal',
    doctorName: 'Dr. Sarah Johnson',
  },
  {
    id: '3',
    testName: 'Blood Glucose',
    date: '2025-01-05',
    result: '95 mg/dL',
    normalRange: '70-100 mg/dL',
    status: 'normal',
    doctorName: 'Dr. Emily Rodriguez',
  },
];

export const mockHealthRecords: HealthRecord[] = [
  {
    id: '1',
    date: '2025-01-10',
    title: 'Annual Physical Examination',
    description: 'Routine checkup. All vitals normal. Continue current medications.',
    doctorName: 'Dr. Emily Rodriguez',
  },
  {
    id: '2',
    date: '2025-01-05',
    title: 'Cardiology Consultation',
    description: 'Heart rate and blood pressure within normal limits. ECG shows normal sinus rhythm.',
    doctorName: 'Dr. Sarah Johnson',
  },
  {
    id: '3',
    date: '2024-12-20',
    title: 'Vaccination Record',
    description: 'Flu vaccine administered. No adverse reactions observed.',
    doctorName: 'Dr. Emily Rodriguez',
  },
];

export const mockHealthMetrics: HealthMetric[] = [
  {
    id: '1',
    type: 'weight',
    value: '75',
    date: '2025-01-14',
    unit: 'kg',
  },
  {
    id: '2',
    type: 'bloodPressure',
    value: '120/80',
    date: '2025-01-14',
    unit: 'mmHg',
  },
  {
    id: '3',
    type: 'heartRate',
    value: '72',
    date: '2025-01-14',
    unit: 'bpm',
  },
  {
    id: '4',
    type: 'glucose',
    value: '95',
    date: '2025-01-14',
    unit: 'mg/dL',
  },
];
