
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { login } from "../utils/auth";

const colors = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  background: "#EFF6FF",
  white: "#FFFFFF",
  text: "#0F172A",
  secondary: "#64748B",
  border: "#BFDBFE",
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const session = await login(email.trim(), password);

      if (session.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/staff");
      }
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>W</Text>
          </View>

          <Text style={styles.appName}>WashTrack</Text>
          <Text style={styles.headerSubtitle}>
            Laundry Management System
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.title}>Welcome Back</Text>

          <Text style={styles.subtitle}>
            Sign in to manage your laundry operations.
          </Text>

          <Text style={styles.label}>Email Address</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setError("");
            }}
          />

          <Text style={styles.label}>Password</Text>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setError("");
              }}
              onSubmitEditing={handleLogin}
            />

            <Pressable
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.showText}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </Pressable>
          </View>

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <Pressable
            style={[
              styles.loginButton,
              loading && styles.disabled,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.loginButtonText}>
                Sign In
              </Text>
            )}
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <Pressable
            style={styles.trackingButton}
            onPress={() => router.push("/customer")}
          >
            <Text style={styles.trackingButtonText}>
              Track Your Laundry
            </Text>
          </Pressable>

          <Text style={styles.trackingHint}>
            Customers can check their laundry status without signing in.
          </Text>
        </View>

        <Text style={styles.footer}>
          WashTrack Laundry Management System
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 75,
    paddingBottom: 110,
    paddingHorizontal: 24,
    alignItems: "center",
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  logo: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 43,
    fontWeight: "900",
    color: colors.primary,
  },
  appName: {
    color: colors.white,
    fontSize: 31,
    fontWeight: "800",
  },
  headerSubtitle: {
    color: "#DBEAFE",
    fontSize: 14,
    marginTop: 7,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    marginHorizontal: 20,
    marginTop: -65,
    padding: 24,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 7,
  },
  subtitle: {
    color: colors.secondary,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 26,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 9,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F8FAFC",
    borderRadius: 11,
    paddingHorizontal: 15,
    height: 52,
    fontSize: 15,
    color: colors.text,
    marginBottom: 19,
  },
  passwordContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F8FAFC",
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    height: 52,
    fontSize: 15,
    color: colors.text,
  },
  showText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 13,
    marginLeft: 10,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 7,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
  disabled: {
    opacity: 0.6,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    color: colors.secondary,
    fontSize: 12,
    marginHorizontal: 15,
    fontWeight: "600",
  },
  trackingButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 11,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  trackingButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  trackingHint: {
    color: colors.secondary,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 14,
  },
  footer: {
    color: colors.secondary,
    textAlign: "center",
    fontSize: 12,
    marginTop: 30,
    paddingHorizontal: 20,
  },
});
