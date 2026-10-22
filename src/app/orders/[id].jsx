
import {
    router,
    useFocusEffect,
    useLocalSearchParams,
} from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { radius, spacing } from "../../constants/theme";
import { getSession } from "../../utils/auth";
import {
    getCustomers,
    getOrderById,
    getOrderTotal,
    getServices,
    updateOrderStatus,
} from "../../utils/storage";

const colors = {
  primary: "#2563EB",
  background: "#EFF6FF",
  white: "#FFFFFF",
  text: "#0F172A",
  secondary: "#64748B",
  border: "#BFDBFE",
};

const statuses = [
  "Pending",
  "Ongoing",
  "Ready",
  "Completed",
];

const statusColors = {
  Pending: "#D97706",
  Ongoing: "#2563EB",
  Ready: "#16A34A",
  Completed: "#475569",
};

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const orderId = Array.isArray(id) ? id[0] : id;

  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/staff/orders");
    }
  };

  const loadOrder = useCallback(async () => {
    try {
      const session = await getSession();

      if (!session || !["staff", "admin"].includes(session.role)) {
        setAuthorized(false);
        router.replace("/login");
        return;
      }

      setAuthorized(true);

      const [foundOrder, customers, services] =
        await Promise.all([
          getOrderById(orderId),
          getCustomers(),
          getServices(),
        ]);

      setOrder(foundOrder);

      if (foundOrder) {
        setCustomer(
          customers.find(
            (item) =>
              String(item.id) ===
              String(foundOrder.customerId)
          ) || null
        );

        setService(
          services.find(
            (item) =>
              String(item.id) ===
              String(foundOrder.serviceId)
          ) || null
        );
      } else {
        setCustomer(null);
        setService(null);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Unable to load order."
      );
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadOrder();
    }, [loadOrder])
  );

  const handleStatusChange = async (newStatus) => {
    if (!order || saving || newStatus === order.status) {
      return;
    }

    setSaving(true);

    try {
      const updatedOrder = await updateOrderStatus(
        order.id,
        newStatus
      );

      setOrder(updatedOrder);

      Alert.alert(
        "Status Updated",
        `Order #${order.id} is now ${newStatus}.`
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Unable to update status."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading || !authorized) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Pressable
            style={styles.backButton}
            onPress={handleBack}
          >
            <Text style={styles.backText}>
              ← Back
            </Text>
          </Pressable>

          <Text style={styles.title}>
            Order Not Found
          </Text>

          <Text style={styles.subtitle}>
            No laundry order was found for ID {orderId}.
          </Text>

          <Pressable
            style={styles.primaryButton}
            onPress={handleBack}
          >
            <Text style={styles.primaryButtonText}>
              Back to Orders
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const currentStatusIndex = statuses.indexOf(order.status);
  const totalPrice = getOrderTotal(order);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Pressable
        style={styles.backButton}
        onPress={handleBack}
      >
        <Text style={styles.backText}>
          ← Back to Orders
        </Text>
      </Pressable>

      <Text style={styles.title}>
        Order #{order.id}
      </Text>

      <Text style={styles.subtitle}>
        Laundry Order Details
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Dynamic Route Information
        </Text>

        <DetailRow
          label="Selected Order ID"
          value={String(orderId)}
        />

        <DetailRow
          label="Route"
          value={`/orders/${orderId}`}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Customer Information
        </Text>

        <DetailRow
          label="Customer Name"
          value={customer?.name || "Unknown"}
        />

        <DetailRow
          label="Customer ID"
          value={String(order.customerId)}
        />

        <DetailRow
          label="Phone Number"
          value={customer?.phone || "Not available"}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Laundry Information
        </Text>

        <DetailRow
          label="Service"
          value={service?.name || "Unknown"}
        />

        <DetailRow
          label="Weight"
          value={`${order.weight} kg`}
        />

        <DetailRow
          label="Total Price"
          value={`₱${totalPrice.toFixed(2)}`}
        />

        <DetailRow
          label="Notes"
          value={order.notes || "None"}
        />

        {order.createdAt && (
          <DetailRow
            label="Date Created"
            value={new Date(
              order.createdAt
            ).toLocaleString()}
          />
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Order Status
        </Text>

        <View style={styles.currentStatus}>
          <Text style={styles.currentStatusLabel}>
            Current Status
          </Text>

          <Text
            style={[
              styles.currentStatusValue,
              {
                color:
                  statusColors[order.status] ||
                  colors.primary,
              },
            ]}
          >
            {order.status}
          </Text>
        </View>

        <Text style={styles.statusHeading}>
          Update Order Status
        </Text>

        {statuses.map((status, index) => {
          const isCurrent = status === order.status;
          const isNext =
            index === currentStatusIndex + 1;

          const enabled = isNext && !saving;

          return (
            <Pressable
              key={status}
              disabled={!enabled}
              style={[
                styles.statusOption,
                isCurrent && styles.selectedStatus,
                enabled && styles.nextStatus,
              ]}
              onPress={() =>
                handleStatusChange(status)
              }
            >
              <View style={styles.statusRow}>
                <Text
                  style={[
                    styles.statusOptionText,
                    isCurrent &&
                      styles.selectedStatusText,
                  ]}
                >
                  {status}
                </Text>

                <Text style={styles.statusHint}>
                  {isCurrent
                    ? "Current"
                    : enabled
                    ? "Tap to update"
                    : ""}
                </Text>
              </View>
            </Pressable>
          );
        })}

        <Text style={styles.helperText}>
          Status follows this sequence:
          {"\n"}
          Pending → Ongoing → Ready → Completed
        </Text>
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={handleBack}
      >
        <Text style={styles.primaryButtonText}>
          Back to Laundry Orders
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>
        {label}
      </Text>

      <Text style={styles.detailValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  center: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    padding: spacing.lg,
    paddingTop: 55,
    paddingBottom: 55,
  },

  backButton: {
    marginBottom: 20,
  },

  backText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },

  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
  },

  subtitle: {
    color: colors.secondary,
    marginTop: 7,
    marginBottom: 22,
  },

  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: 18,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 20,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 15,
  },

  detailLabel: {
    color: colors.secondary,
    fontSize: 14,
    flex: 1,
  },

  detailValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
  },

  currentStatus: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: radius.md,
    marginBottom: 22,
  },

  currentStatusLabel: {
    color: colors.secondary,
    fontSize: 13,
    marginBottom: 6,
  },

  currentStatusValue: {
    fontSize: 23,
    fontWeight: "800",
  },

  statusHeading: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 13,
  },

  statusOption: {
    padding: 15,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    marginBottom: 10,
  },

  selectedStatus: {
    borderColor: colors.primary,
    backgroundColor: "#DBEAFE",
  },

  nextStatus: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statusOptionText: {
    color: colors.secondary,
    fontWeight: "700",
    fontSize: 15,
  },

  selectedStatusText: {
    color: colors.primary,
  },

  statusHint: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },

  helperText: {
    color: colors.secondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 10,
  },

  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: 5,
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
  },
});
