import { StyleSheet, View } from "react-native";
import { colors, radius, spacing } from "../constants/theme";


export function AppCard({ children, style }) {
 return (
   <View style={[styles.card, style]}>
     {children}
   </View>
 );
}


const styles = StyleSheet.create({
 card: {
   backgroundColor: colors.surface,
   borderRadius: radius.lg,
   padding: spacing.md,
   borderWidth: 1,
   borderColor: colors.border,
 },
});
