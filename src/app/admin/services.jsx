
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
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
import { getSession } from "../../utils/auth";
import {
    addService,
    deleteService,
    getServices,
    initializeData,
    updateService,
} from "../../utils/storage";

const colors = {
  primary: "#2563EB",
  background: "#EFF6FF",
  white: "#FFFFFF",
  text: "#0F172A",
  secondary: "#64748B",
  border: "#BFDBFE",
  light: "#DBEAFE",
  danger: "#DC2626",
};

export default function ManageServicesScreen() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [search, setSearch] = useState("");

  const loadServices = useCallback(async () => {
    try {
      const session = await getSession();

      if (!session || session.role !== "admin") {
        setAuthorized(false);
        router.replace("/login");
        return;
      }

      setAuthorized(true);
      await initializeData();

      const data = await getServices();
      setServices(data);
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Unable to load services."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadServices();
    }, [loadServices])
  );

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setName("");
    setPrice("");
  };

  const openAddForm = () => {
    setEditingId(null);
    setName("");
    setPrice("");
    setShowForm(true);
  };

  const openEditForm = (service) => {
    setEditingId(service.id);
    setName(service.name);
    setPrice(String(service.price));
    setShowForm(true);
  };

  const generateServiceId = () => {
    const highest = services.reduce((max, service) => {
      const number = Number(
        String(service.id).replace(/^S/i, "")
      );

      return Number.isSafeInteger(number)
        ? Math.max(max, number)
        : max;
    }, 0);

    return `S${String(highest + 1).padStart(3, "0")}`;
  };

  const handleSave = async () => {
    const serviceName = name.trim();
    const servicePrice = Number(price);

    if (!serviceName || !price.trim()) {
      Alert.alert(
        "Incomplete",
        "Please enter the service name and price."
      );
      return;
    }

    if (!Number.isFinite(servicePrice) || servicePrice <= 0) {
      Alert.alert(
        "Invalid Price",
        "Please enter a price greater than zero."
      );
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await updateService(editingId, {
          name: serviceName,
          price: servicePrice,
        });

        Alert.alert(
          "Success",
          "Laundry service updated successfully."
        );
      } else {
        const newServiceId = generateServiceId();

        await addService({
          id: newServiceId,
          name: serviceName,
          price: servicePrice,
        });

        Alert.alert(
          "Service Added",
          `${serviceName} has been added.\nService ID: ${newServiceId}`
        );
      }

      resetForm();
      await loadServices();
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Unable to save service."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (service) => {
    Alert.alert(
      "Delete Service",
      `Are you sure you want to delete "${service.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteService(service.id);
              await loadServices();

              Alert.alert(
                "Deleted",
                "Laundry service deleted successfully."
              );
            } catch (error) {
              Alert.alert(
                "Cannot Delete",
                error.message || "Unable to delete service."
              );
            }
          },
        },
      ]
    );
  };

  const filteredServices = services.filter((service) => {
    const keyword = search.trim().toLowerCase();

    return (
      service.name.toLowerCase().includes(keyword) ||
      service.id.toLowerCase().includes(keyword)
    );
  });

  const renderService = ({ item }) => (
    <View style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>
            {item.name}
          </Text>

          <Text style={styles.serviceId}>
            Service ID: {item.id}
          </Text>
        </View>

        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>
            ₱{Number(item.price).toFixed(2)}
          </Text>
          <Text style={styles.priceUnit}>per kg</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.editButton}
          onPress={() => openEditForm(item)}
        >
          <Text style={styles.editText}>Edit</Text>
        </Pressable>

        <Pressable
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );

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

  return (
    <View style={styles.container}>
      <FlatList
        data={showForm ? [] : filteredServices}
        keyExtractor={(item) => item.id}
        renderItem={renderService}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <Pressable
              style={styles.backButton}
              onPress={() => router.replace("/admin")}
            >
              <Text style={styles.backText}>
                ← Back to Dashboard
              </Text>
            </Pressable>

            <Text style={styles.title}>
              Manage Services
            </Text>

            <Text style={styles.subtitle}>
              Add and manage laundry services and prices.
            </Text>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>
                Available Laundry Services
              </Text>

              <Text style={styles.summaryNumber}>
                {services.length}
              </Text>
            </View>

            {showForm ? (
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>
                  {editingId
                    ? "Edit Laundry Service"
                    : "Add Laundry Service"}
                </Text>

                {editingId && (
                  <Text style={styles.editingId}>
                    Service ID: {editingId}
                  </Text>
                )}

                <Text style={styles.label}>
                  Service Name
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Example: Comforter Cleaning"
                  placeholderTextColor="#94A3B8"
                  value={name}
                  onChangeText={setName}
                />

                <Text style={styles.label}>
                  Price per Kilogram (₱)
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Example: 80"
                  placeholderTextColor="#94A3B8"
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={setPrice}
                />

                <Text style={styles.helperText}>
                  Service IDs are generated automatically.
                </Text>

                <Pressable
                  style={[
                    styles.primaryButton,
                    saving && styles.disabled,
                  ]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  <Text style={styles.primaryButtonText}>
                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Save Changes"
                      : "Add Service"}
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.cancelButton}
                  onPress={resetForm}
                  disabled={saving}
                >
                  <Text style={styles.cancelText}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
            ) : (
              <>
                <Pressable
                  style={styles.primaryButton}
                  onPress={openAddForm}
                >
                  <Text style={styles.primaryButtonText}>
                    + Add Laundry Service
                  </Text>
                </Pressable>

                <TextInput
                  style={styles.searchInput}
                  placeholder="Search services..."
                  placeholderTextColor="#94A3B8"
                  value={search}
                  onChangeText={setSearch}
                />

                <Text style={styles.sectionTitle}>
                  Service List
                </Text>
              </>
            )}
          </>
        }
        ListEmptyComponent={
          showForm ? null : (
            <Text style={styles.emptyText}>
              No laundry services found.
            </Text>
          )
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
    fontSize: 14,
    marginTop: 7,
    marginBottom: 22,
  },
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  summaryLabel: {
    color: colors.light,
    fontSize: 14,
  },
  summaryNumber: {
    color: colors.white,
    fontSize: 34,
    fontWeight: "800",
    marginTop: 5,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 18,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.6,
  },
  searchInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    marginBottom: 22,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 15,
  },
  serviceCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 17,
    marginBottom: 13,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
  serviceId: {
    color: colors.secondary,
    fontSize: 13,
    marginTop: 5,
  },
  priceBadge: {
    backgroundColor: colors.light,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
  },
  priceText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },
  priceUnit: {
    color: colors.secondary,
    fontSize: 11,
    marginTop: 3,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 17,
  },
  editButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 11,
    borderRadius: 9,
    alignItems: "center",
  },
  editText: {
    color: colors.primary,
    fontWeight: "700",
  },
  deleteButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.danger,
    paddingVertical: 11,
    borderRadius: 9,
    alignItems: "center",
  },
  deleteText: {
    color: colors.danger,
    fontWeight: "700",
  },
  formCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
  },
  formTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 18,
  },
  editingId: {
    color: colors.primary,
    fontWeight: "700",
    marginBottom: 18,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    marginBottom: 17,
  },
  helperText: {
    color: colors.secondary,
    fontSize: 12,
    marginBottom: 22,
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: {
    color: colors.secondary,
    fontWeight: "700",
  },
  emptyText: {
    color: colors.secondary,
    textAlign: "center",
    marginTop: 25,
  },
});
