import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function Post() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Post Screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
