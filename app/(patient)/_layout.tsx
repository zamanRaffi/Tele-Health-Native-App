import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import HomeScreen from './home';
import AppointmentsScreen from './appoinments';
import HealthScreen from './health';
import RecordsScreen from './records';
import ChatbotScreen from './chatbot';
import ProfileScreen from './profile';

const Tab = createMaterialTopTabNavigator();

export default function PatientLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: true,
        tabBarScrollEnabled: true, // ✅ allow horizontal scroll if tabs are too many
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.textSecondary,
        tabBarPressColor: Colors.light.primary + '33', // ripple effect
        tabBarStyle: {
          position: 'absolute',       // float above content
          top: 16,
          left: 16,
          right: 16,
          backgroundColor: Colors.light.card,
          elevation: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          borderRadius: 16,
          overflow: 'hidden',
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.light.primary,
          height: 3,
          borderRadius: 3,
          marginHorizontal: 16,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
          textAlign: 'center',
          flexWrap: 'wrap', // ✅ allow label to wrap into multiple lines
        },
        tabBarShowIcon: true,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <Feather
              name="home"
              size={20}
              color={focused ? Colors.light.primary : Colors.light.textSecondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name="appointments"
        component={AppointmentsScreen}
        options={{
          tabBarLabel: 'Appointments',
          tabBarIcon: ({ focused }) => (
            <Feather
              name="calendar"
              size={20}
              color={focused ? Colors.light.primary : Colors.light.textSecondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name="health"
        component={HealthScreen}
        options={{
          tabBarLabel: 'Health',
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="local-hospital"
              size={20}
              color={focused ? Colors.light.primary : Colors.light.textSecondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name="records"
        component={RecordsScreen}
        options={{
          tabBarLabel: 'Records',
          tabBarIcon: ({ focused }) => (
            <Feather
              name="file-text"
              size={20}
              color={focused ? Colors.light.primary : Colors.light.textSecondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name="chatbot"
        component={ChatbotScreen}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ focused }) => (
            <Feather
              name="message-circle"
              size={20}
              color={focused ? Colors.light.primary : Colors.light.textSecondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Feather
              name="user"
              size={20}
              color={focused ? Colors.light.primary : Colors.light.textSecondary}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
