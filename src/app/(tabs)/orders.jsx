
import { router } from "expo-router";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { laundryOrders } from "../../data/laundryOrders";

const colors = {
  primary: "#2563EB",
  background: "#EFF6FF",
  surface: "#FFFFFF",
  text: "#0F172A",
  textSecondary: "#64748B",
  border: "#BFDBFE",
};

export default function OrdersScreen() {
  const renderOrder = ({ item }) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/details/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>
          Order #{item.id}
        </Text>

        <Text style={styles.status}>
          {item.status}
        </Text>
      </View>

      <Text style={styles.customer}>
        {item.customer}
      </Text>

      <Text style={styles.detail}>
        Service: {item.service}
      </Text>

      <Text style={styles.detail}>
        Weight: {item.weight}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.price}>
          ₱{item.price.toFixed(2)}
        </Text>

        <Text style={styles.viewDetails}>
          View Details →
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Laundry Orders
        </Text>

        <Text style={styles.subtitle}>
          View and manage customer laundry orders.
        </Text>
      </View>

      <FlatList
        data={laundryOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.listTitle}>
            All Orders ({laundryOrders.length})
          </Text>
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

  header: {
    backgroundColor: colors.primary,
    paddingTop: 55,
    paddingBottom: 25,
    paddingHorizontal: 24,
  },

  title: {
    color: colors.surface,
    fontSize: 27,
    fontWeight: "800",
  },

  subtitle: {
    color: "#DBEAFE",
    fontSize: 14,
    marginTop: 6,
  },

  list: {
    padding: 20,
    paddingBottom: 35,
  },

  listTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  orderId: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },

  status: {
    color: colors.primary,
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "600",
  },

  customer: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 10,
  },

  detail: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 5,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  price: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },

  viewDetails: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
});
