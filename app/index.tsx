import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../firebaseConfig";

export default function Index() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpClicked, setSignUpClicked] = useState(false);

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) router.replace("/(tabs)");
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: username,
        photoURL: null,
      });
      if (user) router.replace("/(tabs)");
    } catch (error) {
      console.error("Sign-up error:", error);
    }
  };

  return (
    <View style={styles.container}>
      {signUpClicked ? (
        <Text style={styles.title}>Welcome to Splitmates 👋</Text>
      ) : (
        <Text style={styles.title}>Welcome Back 👋</Text>
      )}
      {signUpClicked ? (
        <Text style={styles.subtitle}>Create an account</Text>
      ) : (
        <Text style={styles.subtitle}>Sign in to continue</Text>
      )}

      {signUpClicked && (
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {signUpClicked ? (
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={signUp}>
            Sign Up
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={signIn}>
            Sign In
          </Text>
        </TouchableOpacity>
      )}

      {!signUpClicked && (
        <TouchableOpacity>
          <Text style={styles.link}>Forgot password?</Text>
        </TouchableOpacity>
      )}
      {signUpClicked ? (
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Already have an account?</Text>
          <TouchableOpacity>
            <Text
              style={[styles.link, { marginLeft: 4, marginTop: 0 }]}
              onPress={() => setSignUpClicked(false)}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don&apos;t have an account?</Text>
          <TouchableOpacity>
            <Text
              style={[styles.link, { marginLeft: 4, marginTop: 0 }]}
              onPress={() => setSignUpClicked(true)}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    color: "#4F46E5",
    fontSize: 14,
    textAlign: "center",
    marginTop: 15,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },
});
