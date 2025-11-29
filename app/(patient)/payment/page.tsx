import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function PaymentPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Options</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#E3106E' }]}
        onPress={() => router.push('/(patient)/payment/bkash')}
      >
        <Text style={styles.buttonText}>Pay with bKash</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4CAF50', marginTop: 15 }]}
        onPress={() => router.push('/(patient)/payment/success')}
      >
        <Text style={styles.buttonText}>Card Payment (Success)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  button: { padding: 15, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 18, textAlign: 'center' },
});
