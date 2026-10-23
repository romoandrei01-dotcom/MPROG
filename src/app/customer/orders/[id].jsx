
import {
    router,
    useFocusEffect,
    useLocalSearchParams,
} from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    getCustomerById,
    getOrderById,
    getServices,
} from "../../../utils/storage";

const colors = {
  primary: "#2563EB",
  background: "#EFF6FF",
  white: "#FFFFFF",
  text: "#0F172A",
  secondary: "#64748B",
  border: "#BFDBFE",
};

export default function CustomerOrderDetailsScreen() {
  const { id, customerId } = useLocalSearchParams();

  const orderId = Array.isArray(id) ? id[0] : id;
  const trackingId = Array.isArray(customerId)
    ? customerId[0]
    : customerId;

  const [order, setOrder] = useState(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadDetails = async () => {
        setLoading(true);

        try {
          const [foundOrder, foundCustomer, services] =
            await Promise.all([
              getOrderById(orderId),
              getCustomerById(trackingId || ""),
              getServices(),
            ]);

          if (!active) return;

          if (
            !foundCustomer ||
            !foundOrder ||
            foundOrder.customerId !== foundCustomer.id
          ) {
            setOrder(null);
            setService(null);
            return;
          }

          setOrder(foundOrder);
          setService(
            services.find(
              (item) => item.id === foundOrder.serviceId
            ) || null
          );
        } catch (error) {
          if (active) {
            setOrder(null);
            setService(null);
          }
        } finally {
          if (active) setLoading(false);
        }
      };

      loadDetails();

      return () => {
        active = false;
      };
    }, [orderId, trackingId])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Pressable onPress={() => router.back()}>
        <Text style={styles.backText}>← Back to Tracking</Text>
      </Pressable>

      {!order ? (
        <View style={styles.card}>
          <Text style={styles.title}>Order Not Found</Text>
          <Text style={styles.subtitle}>
            This order is unavailable for the provided Customer ID.
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.title}>Order #{order.id}</Text>
          <Text style={styles.subtitle}>Your Laundry Details</Text>

          <View style={styles.statusCard}>
            <Text style={styles.statusLabel}>Current Status</Text>
            <Text style={styles.statusValue}>{order.status}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Order Information</Text>

            <DetailRow label="Order ID" value={order.id} />
            <DetailRow label="Customer ID" value={order.customerId} />
            <DetailRow
              label="Service"
              value={service?.name || "Unknown Service"}
            />
            <DetailRow
              label="Weight"
              value={`${order.weight} kg`}
            />
            <DetailRow
              label="Total"
              value={`₱${Number(order.price).toFixed(2)}`}
            />
            <DetailRow
              label="Notes"
              value={order.description || "None"}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Laundry Progress</Text>

            {["Pending", "Ongoing", "Ready", "Completed"].map(
              (status, index, statuses) => {
                const currentIndex = statuses.indexOf(order.status);
                const completed = index <= currentIndex;

                return (
                  <View key={status} style={styles.progressRow}>
                    <View
                      style={[
                        styles.progressDot,
                        completed && styles.progressDotActive,
                      ]}
                    />
                    <Text
                      style={[
                        styles.progressText,
                        completed && styles.progressTextActive,
                      ]}
                    >
                      {status}
                    </Text>
                  </View>
                );
              }
            )}
          </View>

          <Text style={styles.note}>
            Order status is updated by WashTrack staff.
          </Text>
        </>
      )}
    </ScrollView>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
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
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.secondary,
    fontSize: 14,
    marginTop: 7,
    marginBottom: 22,
  },
  statusCard: {
    backgroundColor: colors.primary,
    padding: 22,
    borderRadius: 16,
    marginBottom: 18,
  },
  statusLabel: {
    color: "#DBEAFE",
    fontSize: 14,
  },
  statusValue: {
    color: colors.white,
    fontSize: 27,
    fontWeight: "800",
    marginTop: 8,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
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
    gap: 15,
    marginBottom: 15,
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
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  progressDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#CBD5E1",
    marginRight: 12,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
  },
  progressText: {
    color: colors.secondary,
    fontSize: 15,
  },
  progressTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  note: {
    color: colors.secondary,
    textAlign: "center",
    fontSize: 13,
  },
});
