import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "supabase_auth_session";

export async function saveSession(session: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(TOKEN_KEY, session);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, session);
  }
}

export async function getSession() {
  if (Platform.OS === "web") {
    return localStorage.getItem(TOKEN_KEY);
  } else {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  }
}

export async function deleteSession() {
  if (Platform.OS === "web") {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}
