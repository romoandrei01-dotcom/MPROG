
import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import {
    getCustomerById,
    getOrdersByCustomer,
    getServices,
    initializeData,
} from "../../utils/storage";

const colors = {
  primary: "#2563EB",
  background: "#EFF6FF",
  white: "#FFFFFF",
  text: "#0F172A",
  secondary: "#64748B",
  border: "#BFDBFE",
};

export default function CustomerTrackingScreen() {
  const [customerId, setCustomerId] = useState("");
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = async () => {
    if (!customerId.trim()) {
      Alert.alert("Missing ID", "Please enter your Customer ID.");
      return;
    }

    setLoading(true);
    setSearched(false);

    try {
      await initializeData();

      const foundCustomer = await getCustomerById(customerId);

      if (!foundCustomer) {
        setCustomer(null);
        setOrders([]);
        Alert.alert("Not Found", "Customer ID does not exist.");
        return;
      }

      const [customerOrders, serviceData] = await Promise.all([
        getOrdersByCustomer(foundCustomer.id),
        getServices(),
      ]);

      setCustomer(foundCustomer);
      setOrders(customerOrders);
      setServices(serviceData);
      setSearched(true);
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Unable to retrieve laundry orders."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleIdChange = (value) => {
    setCustomerId(value);
    setCustomer(null);
    setOrders([]);
    setSearched(false);
  };

  const renderOrder = ({ item }) => {
    const service = services.find(
      (entry) => entry.id === item.serviceId
    );

    return (
      <Pressable
        style={styles.orderCard}
        onPress={() =>
          router.push({
            pathname: "/customer/orders/[id]",
            params: {
              id: item.id,
              customerId: customer.id,
            },
          })
        }
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderNumber}>Order #{item.id}</Text>
          <Text style={styles.status}>{item.status}</Text>
        </View>

        <Text style={styles.orderDetail}>
          Service: {service?.name || "Unknown Service"}
        </Text>
        <Text style={styles.orderDetail}>
          Weight: {item.weight} kg
        </Text>
        <Text style={styles.price}>
          ₱{Number(item.price).toFixed(2)}
        </Text>
        <Text style={styles.viewDetails}>View Details →</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={searched ? orders : []}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderOrder}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <Pressable onPress={() => router.replace("/login")}>
              <Text style={styles.backText}>← Back to Login</Text>
            </Pressable>

            <Text style={styles.title}>Track Your Laundry</Text>
            <Text style={styles.subtitle}>
              Enter your Customer ID to check your laundry status.
            </Text>

            <View style={styles.card}>
              <Text style={styles.label}>Customer ID</Text>

              <TextInput
                style={styles.input}
                placeholder="Example: C001"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                value={customerId}
                onChangeText={handleIdChange}
              />

              <Pressable
                style={[styles.button, loading && styles.disabled]}
                onPress={handleTrack}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Track Laundry</Text>
                )}
              </Pressable>
            </View>

            {customer && (
              <View style={styles.customerCard}>
                <Text style={styles.customerLabel}>Customer</Text>
                <Text style={styles.customerName}>{customer.name}</Text>
                <Text style={styles.customerId}>ID: {customer.id}</Text>
              </View>
            )}

            {searched && (
              <Text style={styles.sectionTitle}>
                Your Laundry Orders ({orders.length})
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          searched ? (
            <Text style={styles.emptyText}>
              No laundry orders found for this customer.
            </Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 50,
  },
  backText: {
    color: colors.primary,
    fontWeight: "700",
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondary,
    marginTop: 8,
    marginBottom: 25,
    lineHeight: 21,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    marginBottom: 18,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 15,
  },
  disabled: {
    opacity: 0.6,
  },
  customerCard: {
    backgroundColor: "#DBEAFE",
    padding: 18,
    borderRadius: 14,
    marginBottom: 25,
  },
  customerLabel: {
    color: colors.secondary,
    fontSize: 12,
  },
  customerName: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 4,
  },
  customerId: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 5,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 15,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 17,
    marginBottom: 13,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderNumber: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },
  status: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  orderDetail: {
    color: colors.secondary,
    fontSize: 14,
    marginBottom: 6,
  },
  price: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "800",
    marginTop: 8,
  },
  viewDetails: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "right",
    marginTop: 8,
  },
  emptyText: {
    color: colors.secondary,
    textAlign: "center",
    marginTop: 25,
  },
});
