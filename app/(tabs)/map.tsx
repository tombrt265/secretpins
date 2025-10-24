import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function Map() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* App Icon */}
      <Feather name="map-pin" size={48} color="black" style={styles.icon} />

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>This Month</Text>
        </TouchableOpacity>
      </View>

      {/* Map or Error Message */}
      <View style={styles.emptyBox}>
        {errorMsg ? (
          <Text style={{ color: "red" }}>{errorMsg}</Text>
        ) : location ? (
          <MapView
            style={styles.map}
            region={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker coordinate={location.coords} />
          </MapView>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  icon: {
    marginVertical: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 6,
    marginHorizontal: 30,
    borderBottomColor: "#000",
    borderBottomWidth: 2,
  },
  buttonText: {
    color: "black",
    fontWeight: "600",
    textAlign: "center",
  },
  emptyBox: {
    flex: 1,
    width: "90%",
  },
  map: {
    height: "100%",
    width: "100%",
  },
});
