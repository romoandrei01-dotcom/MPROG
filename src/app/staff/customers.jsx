
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import BackButton from "../../components/BackButton";
import { getSession } from "../../utils/auth";
import {
    addCustomer,
    getCustomers,
    initializeData,
    updateCustomer,
} from "../../utils/storage";

const blue = "#2563EB";

export default function CustomersScreen() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const loadCustomers = useCallback(async () => {
    try {
      const session = await getSession();

      if (!session || !["staff", "admin"].includes(session.role)) {
        router.replace("/login");
        return;
      }

      await initializeData();
      setCustomers(await getCustomers());
    } catch (error) {
      Alert.alert("Error", error.message || "Unable to load customers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCustomers();
    }, [loadCustomers])
  );

  const openAdd = () => {
    setEditing(null);
    setName("");
    setPhone("");
    setAddress("");
    setModalVisible(true);
  };

  const openEdit = (customer) => {
    setEditing(customer);
    setName(customer.name || "");
    setPhone(customer.phone || "");
    setAddress(customer.address || "");
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Required", "Please enter customer name and phone.");
      return;
    }

    try {
      if (editing) {
        await updateCustomer(editing.id, {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
        });
      } else {
        const existing = await getCustomers();

        const nextNumber =
          Math.max(
            0,
            ...existing.map((item) => {
              const number = Number(String(item.id).replace(/\D/g, ""));
              return Number.isFinite(number) ? number : 0;
            })
          ) + 1;

        const id = `C${String(nextNumber).padStart(3, "0")}`;

        await addCustomer({
          id,
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
        });
      }

      setModalVisible(false);
      await loadCustomers();

      Alert.alert(
        "Success",
        editing ? "Customer updated successfully." : "Customer registered successfully."
      );
    } catch (error) {
      Alert.alert("Error", error.message || "Unable to save customer.");
    }
  };

  const filtered = customers.filter((customer) => {
    const query = search.toLowerCase();
    return (
      String(customer.id).toLowerCase().includes(query) ||
      String(customer.name).toLowerCase().includes(query) ||
      String(customer.phone).toLowerCase().includes(query)
    );
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <BackButton />
            <Text style={styles.title}>Manage Customers</Text>
            <Text style={styles.subtitle}>
              Register, search, and update customer information.
            </Text>

            <Pressable style={styles.primaryButton} onPress={openAdd}>
              <Text style={styles.primaryText}>+ Register Customer</Text>
            </Pressable>

            <TextInput
              style={styles.input}
              placeholder="Search name, Customer ID, or phone"
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />

            <Text style={styles.sectionTitle}>
              Customers ({filtered.length})
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.customerName}>{item.name}</Text>
              <Text style={styles.customerId}>{item.id}</Text>
            </View>

            <Text style={styles.detail}>Phone: {item.phone}</Text>
            {!!item.address && (
              <Text style={styles.detail}>Address: {item.address}</Text>
            )}

            <Pressable
              style={styles.editButton}
              onPress={() => openEdit(item)}
            >
              <Text style={styles.editText}>Edit Customer</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={blue} />
          ) : (
            <Text style={styles.empty}>No customers found.</Text>
          )
        }
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editing ? "Edit Customer" : "Register Customer"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <TextInput
              style={styles.input}
              placeholder="Address (Optional)"
              value={address}
              onChangeText={setAddress}
            />

            <Pressable style={styles.primaryButton} onPress={handleSave}>
              <Text style={styles.primaryText}>Save Customer</Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EFF6FF" },
  content: { padding: 20, paddingTop: 50, paddingBottom: 50 },
  title: { fontSize: 26, fontWeight: "800", color: "#0F172A" },
  subtitle: { color: "#64748B", marginTop: 7, marginBottom: 22 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: blue,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  primaryText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    color: "#0F172A",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customerName: { fontSize: 17, fontWeight: "800", color: "#0F172A", flex: 1 },
  customerId: { color: blue, fontWeight: "800", marginLeft: 10 },
  detail: { color: "#64748B", marginTop: 8 },
  editButton: {
    marginTop: 15,
    borderRadius: 9,
    backgroundColor: "#DBEAFE",
    padding: 11,
    alignItems: "center",
  },
  editText: { color: blue, fontWeight: "700" },
  empty: { color: "#64748B", textAlign: "center", marginTop: 25 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
  },
  modalTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 20,
  },
  cancelButton: { alignItems: "center", padding: 12 },
  cancelText: { color: "#64748B", fontWeight: "700" },
});
