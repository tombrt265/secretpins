import { Text, View } from "react-native";
import { auth } from "../../firebaseConfig";

export default function Index() {
  return (
    <View>
      <Text>Welcome back, {auth.currentUser?.displayName}!</Text>
    </View>
  );
}
