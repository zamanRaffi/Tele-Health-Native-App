import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Stack } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import Colors from '../../constants/colors';

export default function PatientRecords() {
  const { labResults, healthRecords } = useApp();
  const [activeTab, setActiveTab] = useState<'lab' | 'records'>('lab');

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Health Records',
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '700' as const,
          },
        }}
      />
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'lab' && styles.tabActive]}
            onPress={() => setActiveTab('lab')}
          >
            <Text
              style={[styles.tabText, activeTab === 'lab' && styles.tabTextActive]}
            >
              Lab Results
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'records' && styles.tabActive]}
            onPress={() => setActiveTab('records')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'records' && styles.tabTextActive,
              ]}
            >
              Medical Records
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'lab' ? (
            <View style={styles.section}>
              {labResults.map((result) => (
                <View key={result.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                      <MaterialCommunityIcons
                        name="test-tube"
                        size={20}
                        color={Colors.light.primary}
                      />
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardTitle}>{result.testName}</Text>
                      <Text style={styles.cardSubtitle}>
                        {result.date} • {result.doctorName}
                      </Text>
                    </View>
                    {result.status === 'normal' ? (
                      <MaterialIcons
                        name="check-circle"
                        size={24}
                        color={Colors.light.success}
                      />
                    ) : (
                      <MaterialIcons
                        name="error-outline"
                        size={24}
                        color={Colors.light.warning}
                      />
                    )}
                  </View>
                  <View style={styles.resultDetails}>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Result:</Text>
                      <Text style={styles.resultValue}>{result.result}</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Normal Range:</Text>
                      <Text style={styles.resultValue}>{result.normalRange}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      result.status === 'normal'
                        ? styles.statusNormal
                        : styles.statusAbnormal,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        result.status === 'normal'
                          ? styles.statusTextNormal
                          : styles.statusTextAbnormal,
                      ]}
                    >
                      {result.status === 'normal' ? 'Normal' : 'Needs Attention'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.section}>
              {healthRecords.map((record) => (
                <View key={record.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                      <Feather
                        name="file-text"
                        size={20}
                        color={Colors.light.primary}
                      />
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardTitle}>{record.title}</Text>
                      <Text style={styles.cardSubtitle}>
                        {record.date} • {record.doctorName}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.description}>{record.description}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 24,
    paddingBottom: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: Colors.light.card,
  },
  tabActive: {
    backgroundColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 24,
    paddingTop: 8,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cardHeader: {
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
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  resultDetails: {
    marginBottom: 12,
    gap: 8,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusNormal: {
    backgroundColor: '#D1FAE5',
  },
  statusAbnormal: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  statusTextNormal: {
    color: '#047857',
  },
  statusTextAbnormal: {
    color: '#92400E',
  },
  description: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
});
