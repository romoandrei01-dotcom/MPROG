import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius, spacing } from "../constants/theme";


export function AppInput({
 label,
 value,
 onChangeText,
 placeholder,
 keyboardType = "default",
}) {
 return (
   <View style={styles.container}>
     {label && <Text style={styles.label}>{label}</Text>}


     <TextInput
       value={value}
       onChangeText={onChangeText}
       placeholder={placeholder}
       placeholderTextColor={colors.textMuted}
       keyboardType={keyboardType}
       style={styles.input}
     />
   </View>
 );
}


const styles = StyleSheet.create({
 container: {
   marginBottom: spacing.md,
 },


 label: {
   color: colors.text,
   fontSize: 14,
   fontWeight: "600",
   marginBottom: spacing.sm,
 },


 input: {
   height: 50,
   borderWidth: 1,
   borderColor: colors.border,
   borderRadius: radius.md,
   backgroundColor: colors.surface,
   paddingHorizontal: spacing.md,
   color: colors.text,
   fontSize: 16,
 },
});
