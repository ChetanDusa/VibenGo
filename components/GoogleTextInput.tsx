import { View, Image, Text } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { icons } from "@/constants";
import { GoogleInputProps } from "@/types/type";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  console.log("Google API Key:", googlePlacesApiKey);
  return (
    <View
    className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle}`}
    >
     <GooglePlacesAutocomplete
  fetchDetails={true}
  placeholder="Search"
  debounce={200}
  minLength={2}
  enablePoweredByContainer={false}
  predefinedPlaces={[]} // ← optional, but safe to add
  styles={{
    textInputContainer: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      marginHorizontal: 20,
      position: "relative",
      shadowColor: "#d4d4d4",
    },
    textInput: {
      backgroundColor: textInputBackgroundColor ?? "white",
      fontSize: 16,
      fontWeight: "600",
      marginTop: 5,
      width: "100%",
      borderRadius: 200,
    },
    listView: {
      backgroundColor: textInputBackgroundColor ?? "white",
      position: "relative",
      top: 0,
      width: "100%",
      borderRadius: 10,
      shadowColor: "#d4d4d4",
      zIndex: 99,
    },
  }}
  onPress={(data, details) => {
    console.log("onPress data:", data);
    console.log("onPress details:", details);
  
    if (!details || !data?.description) {
      console.warn("Missing details or description");
      return;
    }
  
    handlePress({
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      address: data.description,
    });
  }}
  
  query={{
    key: googlePlacesApiKey,
    language: "en",
  }}
  // ✅ Add these below
  onFail={(error) => {
    console.error("Google Autocomplete Failed:", error);
  }}
  onNotFound={() => {
    console.warn("No results found.");
  }}
  renderRow={(data) => <Text style={{ padding: 10 }}>{data.description}</Text>}
  renderLeftButton={() => (
    <View className="justify-center items-center w-6 h-6">
      <Image
        source={icon ?? icons.search}
        className="w-6 h-6"
        resizeMode="contain"
      />
    </View>
  )}
  textInputProps={{
    placeholderTextColor: "gray",
    placeholder: initialLocation ?? "Where do you want to go?",
  }}
/>

    </View>
  );
};

export default GoogleTextInput;
