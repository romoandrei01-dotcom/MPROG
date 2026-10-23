
import { router, useFocusEffect } from "expo-router";
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
import { getSession, logout } from "../../utils/auth";
import {
    getCustomers,
    getOrders,
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

export default function StaffDashboard() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [stats, setStats] = useState({
    customers: 0,
    orders: 0,
    pending: 0,
    ongoing: 0,
    ready: 0,
    completed: 0,
  });

  const loadDashboard = useCallback(async () => {
    try {
      const session = await getSession();

      if (!session || session.role !== "staff") {
        setAuthorized(false);
        router.replace("/login");
        return;
      }

      setAuthorized(true);
      await initializeData();

      const [customers, orders] = await Promise.all([
        getCustomers(),
        getOrders(),
      ]);

      setStats({
        customers: customers.length,
        orders: orders.length,
        pending: orders.filter(
          (order) => order.status === "Pending"
        ).length,
        ongoing: orders.filter(
          (order) => order.status === "Ongoing"
        ).length,
        ready: orders.filter(
          (order) => order.status === "Ready"
        ).length,
        completed: orders.filter(
          (order) => order.status === "Completed"
        ).length,
      });
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadDashboard();
    }, [loadDashboard])
  );

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", "Unable to log out.");
    }
  };

  if (loading || !authorized) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>WASHTRACK</Text>
          <Text style={styles.title}>Staff Dashboard</Text>
          <Text style={styles.subtitle}>
            Laundry operations overview
          </Text>
        </View>

        <View style={styles.logo}>
          <Text style={styles.logoText}>W</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Overview</Text>

      <View style={styles.statsGrid}>
        <StatCard label="Total Orders" value={stats.orders} />
        <StatCard label="Customers" value={stats.customers} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Ongoing" value={stats.ongoing} />
        <StatCard label="Ready for Pickup" value={stats.ready} />
        <StatCard label="Completed" value={stats.completed} />
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <ActionButton
        title="Create Laundry Order"
        subtitle="Register a new laundry transaction"
        primary
        onPress={() => router.push("/staff/create-order")}
      />

      <ActionButton
        title="View Laundry Orders"
        subtitle="Search orders and update their status"
        onPress={() => router.push("/staff/orders")}
      />

      <ActionButton
        title="Manage Customers"
        subtitle="Register, search, and edit customers"
        onPress={() => router.push("/staff/customers")}
      />

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </ScrollView>
  );
}

function StatCard({ label, value }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function ActionButton({ title, subtitle, onPress, primary = false }) {
  return (
    <Pressable
      style={[
        styles.actionCard,
        primary && styles.primaryAction,
      ]}
      onPress={onPress}
    >
      <View style={styles.actionContent}>
        <Text
          style={[
            styles.actionTitle,
            primary && styles.primaryText,
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.actionSubtitle,
            primary && styles.primarySubtitle,
          ]}
        >
          {subtitle}
        </Text>
      </View>

      <Text
        style={[
          styles.arrow,
          primary && styles.primaryText,
        ]}
      >
        ›
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  brand: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 7,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.secondary,
    fontSize: 13,
    marginTop: 6,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  logoText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "900",
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  statCard: {
    width: "48%",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    padding: 17,
    marginBottom: 12,
    minHeight: 105,
    justifyContent: "space-between",
  },
  statLabel: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "600",
  },
  statValue: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: "800",
    marginTop: 10,
  },
  actionCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 17,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryAction: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  actionSubtitle: {
    color: colors.secondary,
    fontSize: 12,
    marginTop: 5,
    lineHeight: 18,
  },
  primaryText: {
    color: colors.white,
  },
  primarySubtitle: {
    color: "#DBEAFE",
  },
  arrow: {
    color: colors.primary,
    fontSize: 28,
    marginLeft: 12,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: "#FCA5A5",
    backgroundColor: "#FEF2F2",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    color: "#DC2626",
    fontWeight: "800",
    fontSize: 15,
  },
});
