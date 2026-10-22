
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    Alert,
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
    addOrder,
    getCustomers,
    getServicePrice,
    getServices,
    initializeData,
} from "../../utils/storage";

const blue = "#2563EB";

export default function CreateOrderScreen() {
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState(null);
  const [service, setService] = useState(null);
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [showServices, setShowServices] = useState(false);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function load() {
        try {
          const session = await getSession();

          if (!session || !["admin", "staff"].includes(session.role)) {
            router.replace("/login");
            return;
          }

          await initializeData();
          const [customerList, serviceList] = await Promise.all([
            getCustomers(),
            getServices(),
          ]);

          if (active) {
            setCustomers(customerList);
            setServices(serviceList);
          }
        } catch (error) {
          Alert.alert("Error", error.message);
        }
      }

      load();
      return () => {
        active = false;
      };
    }, [])
  );

  const matches = customers.filter((item) => {
    const query = search.trim().toLowerCase();
    return (
      query.length > 0 &&
      (
        String(item.name).toLowerCase().includes(query) ||
        String(item.id).toLowerCase().includes(query) ||
        String(item.phone).toLowerCase().includes(query)
      )
    );
  });

  const unitPrice = getServicePrice(service);
  const kilograms = Number(weight) || 0;
  const totalPrice = Number((unitPrice * kilograms).toFixed(2));

  async function handleCreate() {
    if (saving) return;

    if (!customer) {
      Alert.alert("Required", "Please select a customer.");
      return;
    }

    if (!service) {
      Alert.alert("Required", "Please select a laundry service.");
      return;
    }

    if (!Number.isFinite(kilograms) || kilograms <= 0) {
      Alert.alert("Invalid Weight", "Enter a valid laundry weight.");
      return;
    }

    if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
      Alert.alert("Invalid Price", "The service must have a valid price.");
      return;
    }

    setSaving(true);

    try {
      const order = await addOrder({
        customerId: customer.id,
        serviceId: service.id,
        weight: kilograms,
        totalPrice,
        total: totalPrice,
        price: totalPrice,
        notes: notes.trim(),
      });

      Alert.alert(
        "Order Created",
        `Order #${order.id} created successfully.\nTotal: ₱${totalPrice.toFixed(2)}`,
        [
          {
            text: "View Orders",
            onPress: () => router.replace("/staff/orders"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", error.message || "Unable to create order.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <BackButton />

      <Text style={styles.title}>Create Laundry Order</Text>
      <Text style={styles.subtitle}>
        Select a customer and laundry service.
      </Text>

      <Text style={styles.label}>Customer</Text>
      <TextInput
        style={styles.input}
        placeholder="Search name, Customer ID, or phone"
        placeholderTextColor="#94A3B8"
        value={search}
        onChangeText={(value) => {
          setSearch(value);
          setCustomer(null);
        }}
      />

      {customer ? (
        <View style={styles.selected}>
          <Text style={styles.selectedName}>{customer.name}</Text>
          <Text style={styles.muted}>
            {customer.id} • {customer.phone}
          </Text>
          <Pressable
            onPress={() => {
              setCustomer(null);
              setSearch("");
            }}
          >
            <Text style={styles.change}>Change Customer</Text>
          </Pressable>
        </View>
      ) : (
        matches.slice(0, 8).map((item) => (
          <Pressable
            key={String(item.id)}
            style={styles.option}
            onPress={() => {
              setCustomer(item);
              setSearch(item.name);
            }}
          >
            <Text style={styles.optionTitle}>{item.name}</Text>
            <Text style={styles.muted}>
              {item.id} • {item.phone}
            </Text>
          </Pressable>
        ))
      )}

      <Text style={styles.label}>Laundry Service</Text>

      <Pressable
        style={styles.selector}
        onPress={() => setShowServices(!showServices)}
      >
        <Text style={styles.selectorText}>
          {service
            ? `${service.name} - ₱${unitPrice.toFixed(2)}/kg`
            : "Select Laundry Service"}
        </Text>
        <Text style={styles.arrow}>⌄</Text>
      </Pressable>

      {showServices &&
        services.map((item) => (
          <Pressable
            key={String(item.id)}
            style={styles.option}
            onPress={() => {
              setService(item);
              setShowServices(false);
            }}
          >
            <Text style={styles.optionTitle}>{item.name}</Text>
            <Text style={styles.muted}>
              ₱{getServicePrice(item).toFixed(2)} per kg
            </Text>
          </Pressable>
        ))}

      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter laundry weight"
        placeholderTextColor="#94A3B8"
        keyboardType="decimal-pad"
        value={weight}
        onChangeText={setWeight}
      />

      <Text style={styles.label}>Notes (Optional)</Text>
      <TextInput
        style={[styles.input, styles.notes]}
        placeholder="Additional instructions"
        placeholderTextColor="#94A3B8"
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Order Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.muted}>Price per kg</Text>
          <Text style={styles.value}>₱{unitPrice.toFixed(2)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.muted}>Weight</Text>
          <Text style={styles.value}>{kilograms} kg</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>
            ₱{Number.isFinite(totalPrice) ? totalPrice.toFixed(2) : "0.00"}
          </Text>
        </View>
      </View>

      <Pressable
        style={[styles.button, saving && styles.disabled]}
        onPress={handleCreate}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving ? "Creating Order..." : "Create Order"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EFF6FF" },
  content: { padding: 20, paddingTop: 50, paddingBottom: 50 },
  title: { fontSize: 26, fontWeight: "800", color: "#0F172A" },
  subtitle: { color: "#64748B", marginTop: 7, marginBottom: 25 },
  label: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: "#0F172A",
    marginBottom: 18,
  },
  notes: { minHeight: 100, textAlignVertical: "top" },
  selector: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    padding: 15,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectorText: { color: "#0F172A", flex: 1 },
  arrow: { color: blue, fontSize: 23 },
  option: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    borderRadius: 10,
    marginBottom: 8,
  },
  optionTitle: { color: "#0F172A", fontWeight: "700" },
  muted: { color: "#64748B", fontSize: 13, marginTop: 4 },
  selected: {
    backgroundColor: "#DBEAFE",
    padding: 14,
    borderRadius: 12,
    marginBottom: 18,
  },
  selectedName: { color: "#1D4ED8", fontWeight: "800" },
  change: { color: blue, fontWeight: "700", marginTop: 10 },
  summary: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginBottom: 20,
  },
  summaryTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  value: { color: "#0F172A", fontWeight: "600" },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: { color: "#0F172A", fontWeight: "800" },
  totalValue: { color: blue, fontWeight: "800", fontSize: 20 },
  button: {
    backgroundColor: blue,
    padding: 17,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
  disabled: { opacity: 0.6 },
});
