import { useUser } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import { useLocationStore } from "@/store";

export default function AddRideScreen() {
  const { user } = useUser();
  const { setUserLocation, setDestinationLocation } = useLocationStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });

      setLoading(false);
    })();
  }, []);

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    // ✅ This will work with your current Zustand store structure
    setDestinationLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address,
    });

    router.push("/(root)/intermediate"); // next step
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-general-500">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-general-500 px-5">
      <Text className="text-3xl font-JakartaBold mt-6 mb-2 text-black">
        Carpool Mode 🚗
      </Text>

      <Text className="text-base italic text-neutral-800 mb-4">
        Your wheels, your route — pick your vibe, make your ride matter. Carpool to care. 🌍🎶
      </Text>

      <View style={{ height: 16 }} />

      <GoogleTextInput
        icon={require("@/assets/icons/search.png")}
        containerStyle="bg-white shadow-md shadow-neutral-300"
        handlePress={handleDestinationPress}
      />

      <View style={{ height: 24 }} />

      <Text className="text-xl font-JakartaBold mt-6 mb-2 text-black">
        Your current location
      </Text>

      <View style={{ height: 10 }} />

      <View className="h-[300px] rounded-xl overflow-hidden">
        <Map />
      </View>
    </SafeAreaView>
  );
}
