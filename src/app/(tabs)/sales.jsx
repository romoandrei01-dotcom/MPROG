import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppCard } from "../../components/AppCard.jsx";
import { ScreenHeader } from "../../components/ScreenHeader.jsx";
import { colors, spacing } from "../../constants/theme";


export default function SalesScreen() {
 return (
   <SafeAreaView style={styles.container}>
     <ScreenHeader
       title="Sales"
       subtitle="Track your transactions"
     />


     <View style={styles.summaryRow}>
       <AppCard style={styles.summaryCard}>
         <Text style={styles.label}>Today's Sales</Text>
         <Text style={styles.amount}>₱2,450</Text>
       </AppCard>


       <AppCard style={styles.summaryCard}>
         <Text style={styles.label}>Transactions</Text>
         <Text style={styles.amount}>18</Text>
       </AppCard>
     </View>


     <Text style={styles.sectionTitle}>
       Recent Transactions
     </Text>


     <AppCard>
       <View style={styles.transaction}>
         <View>
           <Text style={styles.transactionTitle}>
             Sale #1003
           </Text>
           <Text style={styles.transactionDate}>
             Today, 10:32 AM
           </Text>
         </View>


         <Text style={styles.transactionAmount}>
           ₱450.00
         </Text>
       </View>
     </AppCard>


     <AppCard style={styles.transactionCard}>
       <View style={styles.transaction}>
         <View>
           <Text style={styles.transactionTitle}>
             Sale #1002
           </Text>
           <Text style={styles.transactionDate}>
             Today, 9:18 AM
           </Text>
         </View>


         <Text style={styles.transactionAmount}>
           ₱280.00
         </Text>
       </View>
     </AppCard>
   </SafeAreaView>
 );
}


const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: colors.background,
   padding: spacing.md,
 },


 summaryRow: {
   flexDirection: "row",
   gap: spacing.sm,
   marginBottom: spacing.lg,
 },


 summaryCard: {
   flex: 1,
 },


 label: {
   color: colors.textSecondary,
   fontSize: 13,
 },


 amount: {
   color: colors.primary,
   fontSize: 24,
   fontWeight: "800",
   marginTop: spacing.xs,
 },


 sectionTitle: {
   color: colors.text,
   fontSize: 18,
   fontWeight: "800",
   marginBottom: spacing.sm,
 },


 transactionCard: {
   marginTop: spacing.sm,
 },


 transaction: {
   flexDirection: "row",
   alignItems: "center",
   justifyContent: "space-between",
 },


 transactionTitle: {
   color: colors.text,
   fontSize: 15,
   fontWeight: "700",
 },


 transactionDate: {
   color: colors.textMuted,
   fontSize: 12,
   marginTop: 4,
 },


 transactionAmount: {
   color: colors.success,
   fontSize: 16,
   fontWeight: "800",
 },
});
