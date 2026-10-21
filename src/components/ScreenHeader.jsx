import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../constants/theme";


export function ScreenHeader({ title, subtitle }) {
 return (
   <View style={styles.container}>
     <Text style={styles.title}>{title}</Text>


     {subtitle && (
       <Text style={styles.subtitle}>{subtitle}</Text>
     )}
   </View>
 );
}


const styles = StyleSheet.create({
 container: {
   marginBottom: spacing.lg,
 },


 title: {
   color: colors.text,
   fontSize: 28,
   fontWeight: "800",
 },


 subtitle: {
   color: colors.textSecondary,
   fontSize: 14,
   marginTop: spacing.xs,
 },
});
