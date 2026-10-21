
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { radius, spacing } from "../constants/theme";

const washColors = {
  primary: "#2563EB",
  primaryLight: "#DBEAFE",
  background: "#EFF6FF",
  surface: "#FFFFFF",
  white: "#FFFFFF",
  text: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  border: "#BFDBFE",
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        "Incomplete",
        "Please enter your email and password."
      );
      return;
    }

    try {
      const savedUser = await AsyncStorage.getItem("registeredUser");

      if (!savedUser) {
        Alert.alert(
          "Login Failed",
          "No registered account found. Please register first."
        );
        return;
      }

      const user = JSON.parse(savedUser);

      if (
        email.trim().toLowerCase() === user.email.trim().toLowerCase() &&
        password === user.password
      ) {
        await AsyncStorage.setItem("isLoggedIn", "true");

        router.replace("/(tabs)/products");
      } else {
        Alert.alert(
          "Login Failed",
          "Incorrect email or password."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Unable to log in. Please try again."
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>W</Text>
        </View>

        <Text style={styles.brand}>WashTrack</Text>

        <Text style={styles.tagline}>
          Staff-First Laundry Order and Queue Management System
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Sign In</Text>

        <Text style={styles.subtitle}>
          Welcome back! Sign in to manage laundry orders and queues.
        </Text>

        <Text style={styles.label}>Email Address</Text>

        <TextInput
          style={styles.input}
          placeholder="example@email.com"
          placeholderTextColor={washColors.textMuted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor={washColors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>
            Sign In
          </Text>
        </Pressable>

        <View style={styles.registerRow}>
          <Text style={styles.registerQuestion}>
            New to WashTrack?
          </Text>

          <Pressable onPress={() => router.push("/register")}>
            <Text style={styles.registerLink}>
              Create Account
            </Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.footer}>
        Clean clothes. Organized service.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: washColors.background,
  },

  content: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },

  header: {
    backgroundColor: washColors.primary,
    paddingTop: 70,
    paddingBottom: 80,
    alignItems: "center",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: washColors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  logoText: {
    color: washColors.primary,
    fontSize: 36,
    fontWeight: "800",
  },

  brand: {
    color: washColors.white,
    fontSize: 28,
    fontWeight: "800",
  },

  tagline: {
    color: washColors.primaryLight,
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
    paddingHorizontal: spacing.lg,
  },

  card: {
    backgroundColor: washColors.surface,
    marginHorizontal: spacing.lg,
    marginTop: -45,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: washColors.border,
  },

  title: {
    color: washColors.text,
    fontSize: 27,
    fontWeight: "800",
    marginBottom: 6,
  },

  subtitle: {
    color: washColors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.lg,
  },

  label: {
    color: washColors.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 7,
  },

  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: washColors.border,
    borderRadius: radius.md,
    padding: 14,
    fontSize: 15,
    color: washColors.text,
    marginBottom: spacing.md,
  },

  loginButton: {
    backgroundColor: washColors.primary,
    paddingVertical: 15,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: 5,
  },

  loginButtonText: {
    color: washColors.white,
    fontSize: 16,
    fontWeight: "700",
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 22,
  },

  registerQuestion: {
    color: washColors.textSecondary,
    fontSize: 14,
  },

  registerLink: {
    color: washColors.primary,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 5,
  },

  footer: {
    color: washColors.textMuted,
    textAlign: "center",
    fontSize: 13,
    marginTop: 25,
  },
});
