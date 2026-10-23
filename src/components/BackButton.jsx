
import { Pressable, StyleSheet, Text, View } from "react-native";
import { goToDashboard } from "../utils/navigation";

export default function BackButton({ title = "Back to Dashboard" }) {
  return (
    <Pressable
      style={styles.button}
      onPress={goToDashboard}
      accessibilityRole="button"
    >
      <View style={styles.icon}>
        <Text style={styles.arrow}>‹</Text>
      </View>
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 10,
    marginBottom: 12,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  arrow: {
    color: "#2563EB",
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "600",
  },
  label: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "700",
  },
});
