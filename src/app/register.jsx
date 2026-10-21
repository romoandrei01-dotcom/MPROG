
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

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert(
        "Incomplete",
        "Please complete all fields."
      );
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email address."
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Invalid Password",
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Password Mismatch",
        "Passwords do not match."
      );
      return;
    }

    try {
      const existingUser = await AsyncStorage.getItem("registeredUser");

      if (existingUser) {
        Alert.alert(
          "Account Already Exists",
          "This demo already has a registered account. Please sign in."
        );
        return;
      }

      const newUser = {
        name: name.trim(),
        email: normalizedEmail,
        password: password,
      };

      await AsyncStorage.setItem(
        "registeredUser",
        JSON.stringify(newUser)
      );

      Alert.alert(
        "Registration Successful",
        "Your WashTrack account has been created. Please sign in.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Unable to register. Please try again."
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
        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.subtitle}>
          Join WashTrack to manage laundry orders and queues efficiently.
        </Text>

        <Text style={styles.label}>Full Name</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor={washColors.textMuted}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

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

        <Text style={styles.label}>Confirm Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          placeholderTextColor={washColors.textMuted}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Pressable
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>
            Create Account
          </Text>
        </Pressable>

        <View style={styles.loginRow}>
          <Text style={styles.loginQuestion}>
            Already have an account?
          </Text>

          <Pressable onPress={() => router.replace("/login")}>
            <Text style={styles.loginLink}>
              Sign In
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

  registerButton: {
    backgroundColor: washColors.primary,
    paddingVertical: 15,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: 5,
  },

  registerButtonText: {
    color: washColors.white,
    fontSize: 16,
    fontWeight: "700",
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 22,
  },

  loginQuestion: {
    color: washColors.textSecondary,
    fontSize: 14,
  },

  loginLink: {
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
