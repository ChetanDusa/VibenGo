import { GoogleInputProps } from "@/types/type";
import { useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Make sure this env var is set correctly in your .env or app config
const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

type PlacePrediction = {
  place_id: string;
  description: string;
};

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlacePrediction[]>([]); // ✅ typed array

  const fetchPlaces = async (text: string) => {
    setQuery(text);
    if (text.length < 2) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${apiKey}&language=en`
      );
      const json = await res.json();
      setResults(json.predictions || []);
    } catch (error) {
      console.error("Autocomplete API failed:", error);
    }
  };

  const handleSelect = async (placeId: string, description: string) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`
      );
      const json = await res.json();
      const location = json.result.geometry.location;

      handlePress({
        latitude: location.lat,
        longitude: location.lng,
        address: description,
      });

      setQuery(description);
      setResults([]);
    } catch (error) {
      console.error("Details API failed:", error);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
      }}
    >
      <TextInput
        value={query}
        placeholder={initialLocation ?? "Search for a location"}
        onChangeText={fetchPlaces}
        placeholderTextColor="gray"
        style={{
          padding: 10,
          backgroundColor: textInputBackgroundColor ?? "#f9f9f9",
          borderRadius: 10,
          fontSize: 16,
          fontWeight: "500",
        }}
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ paddingVertical: 10 }}
            onPress={() => handleSelect(item.place_id, item.description)}
          >
            <Text style={{ fontSize: 15 }}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default GoogleTextInput;

