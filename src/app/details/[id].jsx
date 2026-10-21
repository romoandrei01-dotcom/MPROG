
import { router, useLocalSearchParams } from "expo-router";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { laundryOrders } from "../../data/laundryOrders";

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();

  const order = laundryOrders.find(
    (item) => item.id === id
  );

  if (!order) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Order Not Found</Text>

          <Text style={styles.subtitle}>
            The requested laundry order does not exist.
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => router.replace("/(tabs)/orders")}
          >
            <Text style={styles.buttonText}>
              Back to Laundry Orders
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Pressable
        style={styles.backLink}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>
          ← Back to Orders
        </Text>
      </Pressable>

      <Text style={styles.title}>
        Order Details
      </Text>

      <Text style={styles.subtitle}>
        View the information for this laundry order.
      </Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>
            Order #{order.id}
          </Text>

          <Text style={styles.status}>
            {order.status}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Customer Information
        </Text>

        <Text style={styles.label}>
          Customer Name
        </Text>
        <Text style={styles.value}>
          {order.customer}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>
          Laundry Information
        </Text>

        <Text style={styles.label}>
          Service
        </Text>
        <Text style={styles.value}>
          {order.service}
        </Text>

        <Text style={styles.label}>
          Weight
        </Text>
        <Text style={styles.value}>
          {order.weight}
        </Text>

        <Text style={styles.label}>
          Status
        </Text>
        <Text style={styles.value}>
          {order.status}
        </Text>

        <Text style={styles.label}>
          Description
        </Text>
        <Text style={styles.value}>
          {order.description}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.label}>
          Total Amount
        </Text>

        <Text style={styles.price}>
          ₱{order.price.toFixed(2)}
        </Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => router.replace("/(tabs)/orders")}
      >
        <Text style={styles.buttonText}>
          Back to Laundry Orders
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFF6FF",
  },

  content: {
    padding: 24,
    paddingTop: 55,
    paddingBottom: 40,
  },

  backLink: {
    marginBottom: 24,
  },

  backText: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "700",
  },

  title: {
    color: "#0F172A",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },

  subtitle: {
    color: "#64748B",
    fontSize: 14,
    marginBottom: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginBottom: 24,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  orderId: {
    color: "#2563EB",
    fontSize: 20,
    fontWeight: "800",
  },

  status: {
    color: "#2563EB",
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: "700",
  },

  sectionTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 18,
  },

  label: {
    color: "#64748B",
    fontSize: 13,
    marginBottom: 5,
  },

  value: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 18,
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginBottom: 24,
    marginTop: 4,
  },

  price: {
    color: "#2563EB",
    fontSize: 28,
    fontWeight: "800",
  },

  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
