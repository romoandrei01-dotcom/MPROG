
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />

        <Stack.Screen name="staff/index" />
        <Stack.Screen name="staff/customers" />
        <Stack.Screen name="staff/create-order" />
        <Stack.Screen name="staff/orders" />

        <Stack.Screen name="admin/index" />
        <Stack.Screen name="admin/services" />

        <Stack.Screen name="customer/index" />
        <Stack.Screen name="customer/orders/[id]" />

        <Stack.Screen name="orders/[id]" />
      </Stack>
    </>
  );
}
