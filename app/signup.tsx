import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import Colors from "../constants/colors";
import { UserRole } from "../types";
import React from "react";

export default function Signup() {
  const router = useRouter();
  const { signup } = useApp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient");
  const [specialization, setSpecialization] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (selectedRole === "doctor" && !specialization) {
      Alert.alert("Error", "Please enter your specialization");
      return;
    }

    setIsLoading(true);

    try {
      // Check if email is already registered
      const existingUser = await AsyncStorage.getItem(`@telehealth_signup_${email}`);
      if (existingUser) {
        Alert.alert("Email Not Available", "This email is already registered. Please login.");
        return;
      }

      // Signup new user
      const success = await signup(email, password, name, selectedRole, specialization);
      if (success) {
        Alert.alert("Success", "Account created successfully! Please login to continue.", [
          { text: "OK", onPress: () => router.replace("/login") },
        ]);
      } else {
        Alert.alert("Error", "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color={Colors.light.text} />
          </TouchableOpacity>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          {/* ROLE SELECT */}
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>I am a:</Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  selectedRole === "patient" && styles.roleButtonActive,
                ]}
                onPress={() => setSelectedRole("patient")}
              >
                <Feather
                  name="user"
                  size={20}
                  color={selectedRole === "patient" ? Colors.light.primary : Colors.light.textSecondary}
                />
                <Text
                  style={[
                    styles.roleButtonText,
                    selectedRole === "patient" && styles.roleButtonTextActive,
                  ]}
                >
                  Patient
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  selectedRole === "doctor" && styles.roleButtonActive,
                ]}
                onPress={() => setSelectedRole("doctor")}
              >
                <Feather
                  name="user"
                  size={20}
                  color={selectedRole === "doctor" ? Colors.light.primary : Colors.light.textSecondary}
                />
                <Text
                  style={[
                    styles.roleButtonText,
                    selectedRole === "doctor" && styles.roleButtonTextActive,
                  ]}
                >
                  Doctor
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* FORM */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color={Colors.light.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color={Colors.light.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            {selectedRole === "doctor" && (
              <View style={styles.inputContainer}>
                <Feather name="settings" size={20} color={Colors.light.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Specialization (e.g., Cardiologist)"
                  value={specialization}
                  onChangeText={setSpecialization}
                  placeholderTextColor={Colors.light.textSecondary}
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color={Colors.light.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={isLoading}>
              <Text style={styles.buttonText}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  keyboardView: { flex: 1 },
  scrollContent: { padding: 24 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: { fontSize: 32, fontWeight: "700", color: Colors.light.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.light.textSecondary, marginBottom: 32 },
  roleContainer: { marginBottom: 32 },
  roleLabel: { fontSize: 16, fontWeight: "600", marginBottom: 12, color: Colors.light.text },
  roleButtons: { flexDirection: "row", gap: 12 },
  roleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    gap: 8,
  },
  roleButtonActive: { backgroundColor: "#E0F2FE", borderColor: Colors.light.primary },
  roleButtonText: { fontSize: 16, fontWeight: "600", color: Colors.light.textSecondary },
  roleButtonTextActive: { color: Colors.light.primary },
  form: { gap: 16 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 12,
  },
  input: { flex: 1, fontSize: 16, color: Colors.light.text, paddingVertical: 14 },
  button: { backgroundColor: Colors.light.primary, paddingVertical: 18, borderRadius: 12, alignItems: "center", marginTop: 8 },
  buttonText: { fontSize: 18, fontWeight: "600", color: "#fff" },
  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 16 },
  footerText: { fontSize: 16, color: Colors.light.textSecondary },
  footerLink: { fontSize: 16, fontWeight: "600", color: Colors.light.primary },
});
