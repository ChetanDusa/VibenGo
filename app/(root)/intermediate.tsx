import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";

import GoogleTextInput from "@/components/GoogleTextInput";
import { useLocationStore } from "@/store";
import { icons } from "@/constants";
import { Ionicons } from "@expo/vector-icons";

type Stop = {
  latitude: number;
  longitude: number;
  address: string;
  arrivalTime: Date;
};

export default function IntermediateStep() {
  const {
    destinationLatitude,
    destinationLongitude,
    destinationAddress,
  } = useLocationStore();

  const [stops, setStops] = useState<Stop[]>([]);
  const [activeTimePickerIndex, setActiveTimePickerIndex] = useState<number | null>(null);

  const addStop = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setStops([
      ...stops,
      {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
        arrivalTime: new Date(), // Default arrival time
      },
    ]);
  };

  const updateArrivalTime = (index: number, date: Date) => {
    const updatedStops = [...stops];
    updatedStops[index].arrivalTime = date;
    setStops(updatedStops);
  };

  const confirmRide = () => {
    console.log("Destination:", destinationLatitude, destinationLongitude, destinationAddress);
    console.log("Stops:", stops);
    router.push("/(root)/confirm");
  };

  return (
    <SafeAreaView className="flex-1 bg-general-500">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Text className="text-3xl font-JakartaBold mt-6 text-black mb-1">
            Plan Your Route 🧭
          </Text>
          <Text className="text-base italic text-black-300 mb-4">
            Add stops and arrival times to plan your trip smoothly.
          </Text>

          {/* Destination Card */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow">
            <Text className="text-sm text-neutral-500 mb-1">Destination</Text>
            <View className="flex-row items-start gap-2">
              <Ionicons name="location-sharp" size={20} color="#555" />
              <Text className="text-base text-black font-medium flex-1">
                {destinationAddress || "Not set"}
              </Text>
            </View>
          </View>

          {/* Stop Search Input */}
          <GoogleTextInput
            icon={icons.search}
            placeholder="Add an intermediate stop"
            containerStyle="bg-white shadow-md shadow-neutral-300 mb-4 rounded-xl"
            handlePress={addStop}
          />

          {/* Stops List */}
          <View className="h-[300px]">
            <FlatList
              data={stops}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View className="bg-white p-4 rounded-xl mb-3 shadow">
                  <View className="flex-row items-start gap-2 mb-2">
                    <Ionicons name="flag-outline" size={20} color="#555" />
                    <Text className="text-gray-800 font-JakartaMedium flex-1">
                      Stop {index + 1}: {item.address}
                    </Text>
                  </View>

                  {/* Arrival Time Display */}
                  <TouchableOpacity
                    onPress={() => setActiveTimePickerIndex(index)}
                    className="bg-neutral-100 rounded-lg py-2 px-3 flex-row items-center justify-between"
                  >
                    <Text className="text-sm text-gray-700">
                      Arrival:{" "}
                      {item.arrivalTime.toLocaleString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        day: "numeric",
                        month: "short",
                      })}
                    </Text>
                    <Ionicons name="time-outline" size={16} color="#666" />
                  </TouchableOpacity>

                  {/* Time Picker for current stop */}
                  {activeTimePickerIndex === index && (
                    <DateTimePicker
                      value={item.arrivalTime}
                      mode="datetime"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setActiveTimePickerIndex(null);
                        if (selectedDate) updateArrivalTime(index, selectedDate);
                      }}
                    />
                  )}
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </ScrollView>

        {/* Confirm Ride Button Fixed */}
        <View className="absolute bottom-5 left-5 right-5">
          <TouchableOpacity
            onPress={confirmRide}
            className="bg-primary-500 py-4 rounded-xl items-center shadow-lg"
          >
            <Text className="text-white text-lg font-JakartaSemiBold">
              Confirm Ride 🚀
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
