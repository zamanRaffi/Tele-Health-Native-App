import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useApp } from "../../../context/AppContext";
import { mockDoctors } from "../../../mocks/doctors";

export default function PaymentSuccess() {
  const router = useRouter();
  const { doctorId, date, time, type } = useLocalSearchParams<{
    doctorId: string;
    date?: string;
    time?: string;
    type?: "video" | "offline";
  }>();

  const { user, addAppointment } = useApp();
  const doctor = mockDoctors.find((d) => d.id === doctorId);

  if (!doctor || !user) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 18, color: "red" }}>Error: Missing data</Text>
      </View>
    );
  }

  const handleConfirm = () => {
    const appointment = {
      id: Date.now().toString(),
      patientId: user.id,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      patientName: user.name,
      date: date || new Date().toISOString().split("T")[0],
      time: time || "09:00 AM",
      type: type || "video",
      status: "upcoming" as const,
      callLink: type === "video" ? `https://example.com/call/${Date.now()}` : undefined,
    };

    addAppointment(appointment);

    Alert.alert("Success", "Appointment booked successfully!", [
      { text: "OK", onPress: () => router.replace("/(patient)/appointments") },
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", color: "green", marginBottom: 15 }}>
        Payment Successful!
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 30 }}>
        Your appointment with {doctor.name} is ready to be confirmed.
      </Text>

      <TouchableOpacity
        onPress={handleConfirm}
        style={{
          backgroundColor: "#4CAF50",
          padding: 18,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
          Confirm Appointment
        </Text>
      </TouchableOpacity>
    </View>
  );
}
