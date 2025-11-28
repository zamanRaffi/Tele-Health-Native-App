import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function Welcome() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#0EA5E9", "#0891B2", "#06B6D4"]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {/* Main Heart Icon */}
          <View style={styles.iconCircle}>
            <Feather name="heart" size={48} color="#FFFFFF" />
          </View>

          {/* Small Stethoscope Icon */}
          <View style={[styles.iconCircleSmall, { top: 20, right: -10 }]}>
          <Feather name="user" size={28} color="#0EA5E9" />
          </View>

          {/* Small Activity Icon */}
          <View style={[styles.iconCircleSmall, { bottom: 10, left: -20 }]}>
            <Feather name="activity" size={28} color="#0EA5E9" />
          </View>
        </View>

        <Text style={styles.title}>Uppocare</Text>

        <Text style={styles.subtitle}>
          Your Health, Our Priority{"\n"}Anytime, Anywhere
        </Text>

        <View style={styles.features}>
          <View style={styles.feature}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>
              Connect with expert doctors instantly
            </Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>
              Video & in-person consultations
            </Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Track your health journey</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: height * 0.15,
    paddingBottom: 60,
  },
  iconContainer: {
    alignSelf: "center",
    marginBottom: 40,
    position: "relative",
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircleSmall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  title: {
    fontSize: 48,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
    marginBottom: 48,
    lineHeight: 28,
  },
  features: {
    marginBottom: 48,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.95)",
    flex: 1,
  },
});
