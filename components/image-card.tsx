import { useEffect, useState } from "react";
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

interface ImageCardProps {
  imageUri?: string; // remote uri
  imageSource?: ImageSourcePropType; // local require(...)
  onPress: (e: GestureResponderEvent) => void;
  style?: object;
  borderRadius?: number;
  elevation?: number; // android elevation
}

export default function Card({
  imageUri,
  imageSource,
  onPress,
  style,
  borderRadius = 12,
  elevation = 3,
}: ImageCardProps) {
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    if (imageUri) {
      Image.getSize(imageUri, (width, height) => {
        setAspectRatio(width / height);
      });
    }
  }, [imageUri]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.card, { borderRadius, elevation }, style]}
      accessibilityRole="button"
    >
      {(imageUri || imageSource) && (
        <Image
          source={imageSource ?? { uri: imageUri! }}
          style={[
            styles.image,
            {
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius,
            },
            { aspectRatio },
          ]}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    // Android elevation handled by prop
    overflow: "hidden",
    marginVertical: 8,
  },
  image: {
    width: "100%",
    backgroundColor: "#eee",
  },
});
