import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";

const defaultAvatar = "https://via.placeholder.com/150"; // Fallback Image

const ImageUploader: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = useState<string>(defaultAvatar);

  const pickImage = async () => {
    // Berechtigungen anfordern
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "We need permission to access your photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      setAvatarUrl(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />

      <TouchableOpacity style={styles.editButton} onPress={pickImage}>
        <Feather name="edit-2" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default ImageUploader;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
  },
  editButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
