import { useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";

export default function Page() {
  const { signOut } = useAuth();
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const { user } = useUser();

  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);
    router.push("/(root)/find-ride");
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });

      setUserLocation({
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });
    })();
  }, []);

  return (
    <SafeAreaView className="bg-general-500 flex-1">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* --- HEADER START --- */}
        <View className="flex flex-row items-center justify-between my-5">
          <Text className="text-2xl font-JakartaExtraBold">
            Welcome {user?.firstName || user?.emailAddresses[0].emailAddress.split('@')[0]} 👋
          </Text>
          <TouchableOpacity
            onPress={handleSignOut}
            className="justify-center items-center w-10 h-10 rounded-full bg-white"
          >
            <Image source={icons.out} className="w-4 h-4" />
          </TouchableOpacity>
        </View>
        {/* --- HEADER END --- */}

        {/* --- DESTINATION SECTION --- */}
        <View className="mt-2">
          <Text className="text-lg font-JakartaBold mb-2 text-black">
            Select Destination Location
          </Text>
          <GoogleTextInput
            icon={icons.search} // search icon shown inside the text input
            containerStyle="bg-white shadow-md shadow-neutral-300"
            handlePress={handleDestinationPress}
          />
        </View>

        {/* --- CURRENT LOCATION LABEL WITH ICON --- */}
        <View className="flex flex-row items-center mt-2 mb-3">
          <Text className="text-xl font-JakartaBold mr-2">
            Your current location
          </Text>
          <Image source={icons.map} className="w-6 h-6" />
        </View>

        {/* --- MAP --- */}
        <View className="flex flex-row items-center bg-transparent h-[400px]">
          <Map />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
