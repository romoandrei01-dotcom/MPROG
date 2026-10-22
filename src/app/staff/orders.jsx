
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import BackButton from "../../components/BackButton";
import { getSession } from "../../utils/auth";
import {
    getCustomers,
    getOrders,
    getOrderTotal,
    getServices,
    initializeData,
} from "../../utils/storage";

const blue = "#2563EB";
const filters = ["All", "Pending", "Ongoing", "Ready", "Completed"];

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      const session = await getSession();

      if (!session || !["staff", "admin"].includes(session.role)) {
        router.replace("/login");
        return;
      }

      await initializeData();

      const [orderList, customerList, serviceList] = await Promise.all([
        getOrders(),
        getCustomers(),
        getServices(),
      ]);

      setOrders(orderList);
      setCustomers(customerList);
      setServices(serviceList);
    } catch (error) {
      Alert.alert("Error", error.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadOrders();
    }, [loadOrders])
  );

  const getCustomer = (id) =>
    customers.find((item) => String(item.id) === String(id));

  const getService = (id) =>
    services.find((item) => String(item.id) === String(id));

  const filteredOrders = orders.filter((order) => {
    const customer = getCustomer(order.customerId);
    const service = getService(order.serviceId);
    const query = search.trim().toLowerCase();

    const matchesFilter = filter === "All" || order.status === filter;
    const matchesSearch =
      String(order.id).toLowerCase().includes(query) ||
      String(order.customerId).toLowerCase().includes(query) ||
      String(customer?.name || "").toLowerCase().includes(query) ||
      String(service?.name || "").toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const badgeStyle = (status) => {
    switch (status) {
      case "Pending":
        return { backgroundColor: "#FEF3C7", color: "#92400E" };
      case "Ongoing":
        return { backgroundColor: "#DBEAFE", color: "#1D4ED8" };
      case "Ready":
        return { backgroundColor: "#D1FAE5", color: "#047857" };
      case "Completed":
        return { backgroundColor: "#E2E8F0", color: "#475569" };
      default:
        return { backgroundColor: "#F1F5F9", color: "#475569" };
    }
  };

  const renderOrder = ({ item }) => {
    const customer = getCustomer(item.customerId);
    const service = getService(item.serviceId);
    const badge = badgeStyle(item.status);
    const amount = getOrderTotal(item);

    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/orders/[id]",
            params: { id: String(item.id) },
          })
        }
      >
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: badge.backgroundColor },
            ]}
          >
            <Text style={[styles.badgeText, { color: badge.color }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.customerName}>
          {customer?.name || item.customerId}
        </Text>

        <Text style={styles.detail}>
          Service: {service?.name || item.serviceId}
        </Text>

        <Text style={styles.detail}>
          Weight: {item.weight} kg
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.amount}>
            ₱{amount.toFixed(2)}
          </Text>
          <Text style={styles.viewDetails}>View Details ›</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderOrder}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <BackButton />

            <Text style={styles.title}>Laundry Orders</Text>
            <Text style={styles.subtitle}>
              View and manage customer laundry orders.
            </Text>

            <Pressable
              style={styles.createButton}
              onPress={() => router.push("/staff/create-order")}
            >
              <Text style={styles.createText}>+ Create New Order</Text>
            </Pressable>

            <TextInput
              style={styles.searchInput}
              placeholder="Search order ID, customer, or service"
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
              contentContainerStyle={styles.filterContent}
            >
              {filters.map((item) => (
                <Pressable
                  key={item}
                  style={[
                    styles.filterButton,
                    filter === item && styles.activeFilter,
                  ]}
                  onPress={() => setFilter(item)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      filter === item && styles.activeFilterText,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>
              Orders ({filteredOrders.length})
            </Text>
          </>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={blue} />
          ) : (
            <Text style={styles.empty}>No orders found.</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EFF6FF" },
  content: { padding: 20, paddingTop: 50, paddingBottom: 50 },
  title: { fontSize: 26, fontWeight: "800", color: "#0F172A" },
  subtitle: { color: "#64748B", marginTop: 7, marginBottom: 22 },
  createButton: {
    backgroundColor: blue,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  createText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    padding: 14,
    marginBottom: 17,
    color: "#0F172A",
  },
  filterScroll: { marginBottom: 22 },
  filterContent: { gap: 8, paddingRight: 10 },
  filterButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  activeFilter: { backgroundColor: blue, borderColor: blue },
  filterText: { color: blue, fontWeight: "700", fontSize: 13 },
  activeFilterText: { color: "#FFFFFF" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 13,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 15,
    padding: 17,
    marginBottom: 13,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderId: { color: "#0F172A", fontSize: 16, fontWeight: "800" },
  badge: { borderRadius: 20, paddingHorizontal: 11, paddingVertical: 6 },
  badgeText: { fontSize: 12, fontWeight: "800" },
  customerName: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  detail: { color: "#64748B", fontSize: 13, marginBottom: 6 },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    marginTop: 12,
    paddingTop: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amount: { color: blue, fontSize: 19, fontWeight: "800" },
  viewDetails: { color: blue, fontSize: 13, fontWeight: "700" },
  empty: { textAlign: "center", color: "#64748B", marginTop: 25 },
});
