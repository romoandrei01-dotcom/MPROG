import { useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";


import { SafeAreaView } from "react-native-safe-area-context";
import { AppButton } from "../../components/AppButton.jsx";
import { AppCard } from "../../components/AppCard.jsx";
import { AppInput } from "../../components/AppInput.jsx";
import { ScreenHeader } from "../../components/ScreenHeader.jsx";


import {
    colors,
    spacing
} from "../../constants/theme";


const initialProducts = [
 {
   id: "1",
   name: "Coffee",
   price: 120,
   stock: 20,
 },
 {
   id: "2",
   name: "Iced Tea",
   price: 85,
   stock: 15,
 },
 {
   id: "3",
   name: "Burger",
   price: 180,
   stock: 8,
 },
];


export default function ProductsScreen() {
 const [products, setProducts] = useState(initialProducts);
 const [showForm, setShowForm] = useState(false);


 const [name, setName] = useState("");
 const [price, setPrice] = useState("");
 const [stock, setStock] = useState("");


 function addProduct() {
   if (!name || !price || !stock) {
     Alert.alert("Missing information", "Please complete all fields.");
     return;
   }


   const newProduct = {
     id: Date.now().toString(),
     name,
     price: Number(price),
     stock: Number(stock),
   };


   setProducts((current) => [newProduct, ...current]);


   setName("");
   setPrice("");
   setStock("");
   setShowForm(false);
 }


 function deleteProduct(id) {
   Alert.alert(
     "Delete Product",
     "Are you sure you want to delete this product?",
     [
       {
         text: "Cancel",
         style: "cancel",
       },
       {
         text: "Delete",
         style: "destructive",
         onPress: () => {
           setProducts((current) =>
             current.filter((product) => product.id !== id)
           );
         },
       },
     ]
   );
 }


 function renderProduct({ item }) {
   return (
     <AppCard style={styles.productCard}>
       <View style={styles.productInfo}>
         <Text style={styles.productName}>{item.name}</Text>


         <Text style={styles.price}>
           ₱{item.price.toFixed(2)}
         </Text>


         <Text style={styles.stock}>
           {item.stock} in stock
         </Text>
       </View>


       <View style={styles.actions}>
         <AppButton
           title="Delete"
           variant="danger"
           onPress={() => deleteProduct(item.id)}
         />
       </View>
     </AppCard>
   );
 }


 return (
   <SafeAreaView style={styles.container}>
     <ScreenHeader
       title="Products"
       subtitle={`${products.length} products`}
     />


     {!showForm && (
       <View style={styles.addButton}>
         <AppButton
           title="+ Add Product"
           onPress={() => setShowForm(true)}
         />
       </View>
     )}


     {showForm && (
       <AppCard style={styles.form}>
         <Text style={styles.formTitle}>New Product</Text>


         <AppInput
           label="Product Name"
           value={name}
           onChangeText={setName}
           placeholder="e.g. Coffee"
         />


         <AppInput
           label="Price"
           value={price}
           onChangeText={setPrice}
           placeholder="0.00"
           keyboardType="decimal-pad"
         />


         <AppInput
           label="Stock"
           value={stock}
           onChangeText={setStock}
           placeholder="0"
           keyboardType="number-pad"
         />


         <View style={styles.formActions}>
           <AppButton
             title="Save Product"
             onPress={addProduct}
           />


           <View style={styles.cancelButton}>
             <AppButton
               title="Cancel"
               variant="secondary"
               onPress={() => setShowForm(false)}
             />
           </View>
         </View>
       </AppCard>
     )}


     <FlatList
       data={products}
       keyExtractor={(item) => item.id}
       renderItem={renderProduct}
       contentContainerStyle={styles.list}
       showsVerticalScrollIndicator={false}
     />
   </SafeAreaView>
 );
}


const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: colors.background,
   padding: spacing.md,
 },


 addButton: {
   marginBottom: spacing.md,
 },


 form: {
   marginBottom: spacing.md,
 },


 formTitle: {
   fontSize: 18,
   fontWeight: "800",
   color: colors.text,
   marginBottom: spacing.md,
 },


 formActions: {
   marginTop: spacing.sm,
 },


 cancelButton: {
   marginTop: spacing.sm,
 },


 list: {
   paddingBottom: 100,
 },


 productCard: {
   flexDirection: "row",
   alignItems: "center",
   marginBottom: spacing.sm,
 },


 productInfo: {
   flex: 1,
 },


 productName: {
   color: colors.text,
   fontSize: 17,
   fontWeight: "700",
   marginBottom: spacing.xs,
 },


 price: {
   color: colors.primary,
   fontSize: 16,
   fontWeight: "700",
 },


 stock: {
   color: colors.textSecondary,
   fontSize: 13,
   marginTop: spacing.xs,
 },


 actions: {
   width: 100,
 },
});
