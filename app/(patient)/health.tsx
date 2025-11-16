import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { useApp } from '../../context/AppContext';
import Colors from '../../constants/colors';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

type MetricType = 'weight' | 'bloodPressure' | 'heartRate' | 'glucose';

export default function PatientHealth() {
  const { healthMetrics, addHealthMetric } = useApp();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<MetricType>('weight');
  const [value, setValue] = useState<string>('');

  const metricTypes = [
    { type: 'weight' as MetricType, label: 'Weight', unit: 'kg', icon: FontAwesome5, iconName: 'weight', color: '#3B82F6' },
    { type: 'bloodPressure' as MetricType, label: 'Blood Pressure', unit: 'mmHg', icon: FontAwesome5, iconName: 'heartbeat', color: '#EF4444' },
    { type: 'heartRate' as MetricType, label: 'Heart Rate', unit: 'bpm', icon: FontAwesome5, iconName: 'heart', color: '#EC4899' },
    { type: 'glucose' as MetricType, label: 'Glucose', unit: 'mg/dL', icon: MaterialCommunityIcons, iconName: 'water', color: '#8B5CF6' },
  ];

  const handleAddMetric = () => {
    if (!value) {
      Alert.alert('Error', 'Please enter a value');
      return;
    }

    const metric = metricTypes.find((m) => m.type === selectedType);
    if (!metric) return;

    addHealthMetric({
      id: Date.now().toString(),
      type: selectedType,
      value,
      date: new Date().toISOString().split('T')[0],
      unit: metric.unit,
    });

    setValue('');
    setModalVisible(false);
    Alert.alert('Success', 'Health metric added successfully');
  };

  const getLatestMetric = (type: MetricType) => {
    const metrics = healthMetrics.filter((m) => m.type === type);
    return metrics.length > 0 ? metrics[metrics.length - 1] : null;
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Health Tracker',
          headerStyle: { backgroundColor: Colors.light.background },
          headerTitleStyle: { fontSize: 20, fontWeight: '700' },
        }}
      />
      <View style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Metrics</Text>
            <View style={styles.metricsGrid}>
              {metricTypes.map((metric) => {
                const latest = getLatestMetric(metric.type);
                const Icon = metric.icon;
                return (
                  <View key={metric.type} style={styles.metricCard}>
                    <View style={[styles.metricIcon, { backgroundColor: `${metric.color}20` }]}>
                      <Icon name={metric.iconName} size={24} color={metric.color} />
                    </View>
                    <Text style={styles.metricLabel}>{metric.label}</Text>
                    {latest ? (
                      <>
                        <Text style={styles.metricValue}>{latest.value} {latest.unit}</Text>
                        <Text style={styles.metricDate}>{latest.date}</Text>
                      </>
                    ) : (
                      <Text style={styles.metricEmpty}>No data</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>History</Text>
            {healthMetrics.length > 0 ? (
              healthMetrics.slice().reverse().map((metric) => {
                const type = metricTypes.find((m) => m.type === metric.type);
                if (!type) return null;
                const Icon = type.icon;
                return (
                  <View key={metric.id} style={styles.historyCard}>
                    <View style={[styles.historyIcon, { backgroundColor: `${type.color}20` }]}>
                      <Icon name={type.iconName} size={18} color={type.color} />
                    </View>
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyLabel}>{type.label}</Text>
                      <Text style={styles.historyDate}>{metric.date}</Text>
                    </View>
                    <Text style={styles.historyValue}>{metric.value} {metric.unit}</Text>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <FontAwesome5 name="info-circle" size={48} color={Colors.light.textSecondary} />
                <Text style={styles.emptyText}>No health data yet</Text>
                <Text style={styles.emptySubtext}>Start tracking your health metrics</Text>
              </View>
            )}
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <FontAwesome5 name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Health Metric</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <FontAwesome5 name="times" size={24} color={Colors.light.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.typeSelector}>
                {metricTypes.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <TouchableOpacity
                      key={metric.type}
                      style={[
                        styles.typeButton,
                        selectedType === metric.type && styles.typeButtonActive,
                        { borderColor: metric.color },
                      ]}
                      onPress={() => setSelectedType(metric.type)}
                    >
                      <Icon
                        name={metric.iconName}
                        size={20}
                        color={selectedType === metric.type ? metric.color : Colors.light.textSecondary}
                      />
                      <Text style={[
                        styles.typeButtonText,
                        selectedType === metric.type && { color: metric.color },
                      ]}>
                        {metric.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={`Enter value (${metricTypes.find((m) => m.type === selectedType)?.unit})`}
                  value={value}
                  onChangeText={setValue}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.light.textSecondary}
                />
              </View>

              <TouchableOpacity style={styles.addButton} onPress={handleAddMetric}>
                <Text style={styles.addButtonText}>Add Metric</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.light.background,
    },
    content: {
      flex: 1,
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
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    metricCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: Colors.light.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: Colors.light.border,
    },
    metricIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    metricLabel: {
      fontSize: 14,
      color: Colors.light.textSecondary,
      marginBottom: 8,
    },
    metricValue: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: Colors.light.text,
      marginBottom: 4,
    },
    metricDate: {
      fontSize: 12,
      color: Colors.light.textSecondary,
    },
    metricEmpty: {
      fontSize: 14,
      color: Colors.light.textSecondary,
      fontStyle: 'italic' as const,
    },
    historyCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.light.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: Colors.light.border,
    },
    historyIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    historyInfo: {
      flex: 1,
    },
    historyLabel: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: Colors.light.text,
      marginBottom: 2,
    },
    historyDate: {
      fontSize: 12,
      color: Colors.light.textSecondary,
    },
    historyValue: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: Colors.light.text,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: Colors.light.text,
      marginTop: 16,
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: Colors.light.textSecondary,
    },
    fab: {
      position: 'absolute' as const,
      right: 24,
      bottom: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: Colors.light.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: Colors.light.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      paddingBottom: 40,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: Colors.light.text,
    },
    typeSelector: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 24,
    },
    typeButton: {
      flex: 1,
      minWidth: '45%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 16,
      borderRadius: 12,
      backgroundColor: Colors.light.card,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    typeButtonActive: {
      backgroundColor: '#F0F9FF',
    },
    typeButtonText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: Colors.light.textSecondary,
    },
    inputContainer: {
      marginBottom: 24,
    },
    input: {
      backgroundColor: Colors.light.card,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 16,
      fontSize: 16,
      color: Colors.light.text,
      borderWidth: 1,
      borderColor: Colors.light.border,
    },
    addButton: {
      backgroundColor: Colors.light.primary,
      paddingVertical: 18,
      borderRadius: 12,
      alignItems: 'center',
    },
    addButtonText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: '#FFFFFF',
    },
  });

