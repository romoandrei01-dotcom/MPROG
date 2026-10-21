import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppCard } from "../../components/AppCard.jsx";
import { ScreenHeader } from "../../components/ScreenHeader.jsx";
import { colors, spacing } from "../../constants/theme.js";


const inventory = [
 {
   name: "Coffee",
   stock: 20,
 },
 {
   name: "Iced Tea",
   stock: 15,
 },
 {
   name: "Burger",
   stock: 8,
 },
 {
   name: "French Fries",
   stock: 3,
 },
];


export default function InventoryScreen() {
 return (
   <SafeAreaView style={styles.container}>
   <View>
     <ScreenHeader
       title="Inventory"
       subtitle="Monitor your stock levels"
     />


     {inventory.map((item) => {
       const lowStock = item.stock <= 5;


       return (
         <AppCard key={item.name} style={styles.card}>
           <View>
             <Text style={styles.name}>{item.name}</Text>


             <Text
               style={[
                 styles.stock,
                 lowStock && styles.lowStock,
               ]}
             >
               {item.stock} units
             </Text>
           </View>


           <View
             style={[
               styles.status,
               lowStock
                 ? styles.statusLow
                 : styles.statusGood,
             ]}
           >
             <Text
               style={[
                 styles.statusText,
                 lowStock
                   ? styles.statusTextLow
                   : styles.statusTextGood,
               ]}
             >
               {lowStock ? "Low Stock" : "In Stock"}
             </Text>
           </View>
         </AppCard>
       );
     })}
     </View>
   </SafeAreaView>
 );
}


const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: colors.background,
   padding: spacing.md,
 },


 card: {
   flexDirection: "row",
   alignItems: "center",
   justifyContent: "space-between",
   marginBottom: spacing.sm,
 },


 name: {
   color: colors.text,
   fontSize: 16,
   fontWeight: "700",
 },


 stock: {
   color: colors.textSecondary,
   fontSize: 13,
   marginTop: 4,
 },


 lowStock: {
   color: colors.danger,
 },


 status: {
   paddingHorizontal: spacing.sm,
   paddingVertical: 6,
   borderRadius: 20,
 },


 statusGood: {
   backgroundColor: colors.successLight,
 },


 statusLow: {
   backgroundColor: colors.dangerLight,
 },


 statusText: {
   fontSize: 12,
   fontWeight: "700",
 },


 statusTextGood: {
   color: colors.success,
 },


 statusTextLow: {
   color: colors.danger,
 },
});
