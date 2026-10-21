import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton.jsx";
import { colors, radius, spacing } from "../constants/theme";


export default function WelcomeScreen() {
 return (
   <View style={styles.container}>
     <View style={styles.content}>
       <View style={styles.logo}>
         <Text style={styles.logoText}>P</Text>
       </View>


       <Text style={styles.title}>Simple POS</Text>


       <Text style={styles.subtitle}>
         Manage your products, sales, and inventory in one simple place.
       </Text>


       <AppButton
         title="Get Started"
         onPress={() => router.push("/login")}
       />
     </View>


     <Text style={styles.footer}>Point of Sale System</Text>
   </View>
 );
}


const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: colors.background,
   justifyContent: "space-between",
   padding: spacing.xl,
 },


 content: {
   flex: 1,
   justifyContent: "center",
   alignItems: "center",
 },


 logo: {
   width: 84,
   height: 84,
   borderRadius: radius.xl,
   backgroundColor: colors.primary,
   justifyContent: "center",
   alignItems: "center",
   marginBottom: spacing.lg,
 },


 logoText: {
   color: colors.white,
   fontSize: 42,
   fontWeight: "800",
 },


 title: {
   color: colors.text,
   fontSize: 34,
   fontWeight: "800",
   marginBottom: spacing.sm,
 },


 subtitle: {
   color: colors.textSecondary,
   fontSize: 16,
   lineHeight: 24,
   textAlign: "center",
   maxWidth: 320,
   marginBottom: spacing.xl,
 },


 footer: {
   color: colors.textMuted,
   textAlign: "center",
 },
});
