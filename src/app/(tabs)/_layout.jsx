
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, Tabs, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../../constants/theme";

function TabIcon({ label, color }) {
  return (
    <Text
      style={{
        color,
        fontSize: 18,
        fontWeight: "800",
      }}
    >
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const [authenticated, setAuthenticated] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function checkLogin() {
        try {
          const session = await AsyncStorage.getItem("isLoggedIn");
          if (active) {
            setAuthenticated(session === "true");
          }
        } catch {
          if (active) setAuthenticated(false);
        }
      }

      setAuthenticated(null);
      checkLogin();

      return () => {
        active = false;
      };
    }, [])
  );

  if (authenticated === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!authenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,

        tabBarStyle: {
          height: 64 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 8,

          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
          tabBarIcon: ({ color }) => (
            <TabIcon label="P" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="sales"
        options={{
          title: "Sales",
          tabBarIcon: ({ color }) => (
            <TabIcon label="$" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="inventory"
        options={{
          title: "Inventory",
          tabBarIcon: ({ color }) => (
            <TabIcon label="I" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
