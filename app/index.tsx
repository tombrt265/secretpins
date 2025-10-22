import { Redirect } from "expo-router";

export default function Index() {
  // Redirect root to the tabs layout
  return <Redirect href="/(tabs)/home" />;
}
