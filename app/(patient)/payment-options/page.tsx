import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { mockDoctors } from "../../../mocks/doctors";

export default function PaymentOptions() {
  const router = useRouter();
//   const { doctorId } = useLocalSearchParams<{ doctorId: string }>();
//   const doctor = mockDoctors.find(d => d.id === doctorId);

//   if (!doctor) return <View style={{ flex: 1, padding: 20 }}><Text>Doctor not found</Text></View>;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 20 }}>
        Choose Payment Method
      </Text>

      <TouchableOpacity
        onPress={() => router.push(`/(patient)/payment/bkash`)}
        style={{ padding: 15, backgroundColor: "#E3106E", borderRadius: 10 }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 18 }}>
          Pay with bKash
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push(`/(patient)/payment/success`)}
        style={{ padding: 15, backgroundColor: "#4CAF50", borderRadius: 10, marginTop: 15 }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 18 }}>
          Dummy Card Payment (Success)
        </Text>
      </TouchableOpacity>
    </View>
  );
}
