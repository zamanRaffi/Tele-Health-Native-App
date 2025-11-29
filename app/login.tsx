import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Colors from "../constants/colors";
import { useApp } from "../context/AppContext";
import { UserRole } from "../types";

export default function Login() {
  const router = useRouter();
  const { login } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const storedData = await AsyncStorage.getItem(`@telehealth_signup_${email}`);
      if (!storedData) {
        Alert.alert("No Account", "This email is not registered. Please sign up first.");
        setLoading(false);
        return;
      }

      const userData = JSON.parse(storedData);
      if (userData.role !== selectedRole) {
        Alert.alert("Role Mismatch", `Please select the correct role (${userData.role})`);
        setLoading(false);
        return;
      }

      const success = await login(email, password, selectedRole);
      if (success) {
        if (selectedRole === "patient") {
          router.replace("/(patient)/home");
        } else {
          router.replace("/(doctor)/appointments");
        }
      } else {
        Alert.alert("Error", "Login failed. Please try again.");
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "An error occurred during login.");
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >

          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          {/* Role Selector */}
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>I am a:</Text>

            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  selectedRole === "patient" && styles.activeRoleButton,
                ]}
                onPress={() => setSelectedRole("patient")}
              >
                <Feather
                  name="user"
                  size={18}
                  color={
                    selectedRole === "patient"
                      ? Colors.light.primary
                      : Colors.light.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.roleText,
                    selectedRole === "patient" && styles.activeRoleText,
                  ]}
                >
                  Patient
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  selectedRole === "doctor" && styles.activeRoleButton,
                ]}
                onPress={() => setSelectedRole("doctor")}
              >
                <Feather
                  name="user"
                  size={18}
                  color={
                    selectedRole === "doctor"
                      ? Colors.light.primary
                      : Colors.light.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.roleText,
                    selectedRole === "doctor" && styles.activeRoleText,
                  ]}
                >
                  Doctor
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* GLASS FORM */}
          <BlurView intensity={25} tint="light" style={styles.glassBox}>
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color={Colors.light.textSecondary} />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor={Colors.light.textSecondary}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color={Colors.light.textSecondary} />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={Colors.light.textSecondary}
                style={styles.input}
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>
          </BlurView>

          <View style={styles.footer}>
            <Text style={styles.footerTxt}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={styles.footerLink}> Sign Up</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  scroll: {
    padding: 24,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: Colors.light.text,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 17,
    color: Colors.light.textSecondary,
    marginBottom: 32,
  },

  roleContainer: {
    marginBottom: 28,
  },

  roleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 12,
  },

  roleButtons: {
    flexDirection: "row",
    gap: 12,
  },

  roleButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  activeRoleButton: {
    backgroundColor: "#E0F2FE",
    borderColor: Colors.light.primary,
  },

  roleText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.textSecondary,
  },

  activeRoleText: {
    color: Colors.light.primary,
  },

  glassBox: {
    padding: 20,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
     borderColor: "rgba(255,255,255,0.3)",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    // elevation: 6,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: Colors.light.text,
  },

  button: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },

  footerTxt: {
    color: Colors.light.textSecondary,
    fontSize: 16,
  },

  footerLink: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.primary,
  },
});
