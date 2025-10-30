import { Feather } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";

export default function Layout() {
  const auth = useContext(AuthContext);
  const router = useRouter();

  const loading = auth?.loading ?? true;
  const user = auth?.user ?? null;

  useEffect(() => {
    if (loading) return;
    if (user) return;
    router.replace("/(auth)/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: () => <Feather name="home" size={24} color="black" />,
          tabBarIconStyle: { margin: "auto" },
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: () => <Feather name="plus" size={24} color="black" />,
          tabBarIconStyle: { margin: "auto" },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: () => <Feather name="user" size={24} color="black" />,
          tabBarIconStyle: { margin: "auto" },
        }}
      />
    </Tabs>
  );
}
