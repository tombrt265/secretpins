import Feather from "@expo/vector-icons/Feather";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: () => <Feather name="home" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="expense-form"
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: () => (
            <Feather name="plus-circle" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: () => <Feather name="user" size={24} color="black" />,
        }}
      />
    </Tabs>
  );
}
