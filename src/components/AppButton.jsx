import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
} from "react-native";


import {
    colors,
    radius,
    spacing,
} from "../constants/theme";


export function AppButton({
 title,
 onPress,
 loading = false,
 variant = "primary",
}) {
 const backgroundColor =
   variant === "danger"
     ? colors.danger
     : variant === "secondary"
       ? colors.primaryLight
       : colors.primary;


 const textColor =
   variant === "secondary"
     ? colors.primaryDark
     : colors.white;


 return (
   <Pressable
     onPress={onPress}
     disabled={loading}
     style={({ pressed }) => [
       styles.button,
       { backgroundColor },
       pressed && styles.pressed,
     ]}
   >
     {loading ? (
       <ActivityIndicator color={textColor} />
     ) : (
       <Text style={[styles.text, { color: textColor }]}>
         {title}
       </Text>
     )}
   </Pressable>
 );
}


const styles = StyleSheet.create({
 button: {
   minHeight: 52,
   paddingHorizontal: spacing.lg,
   borderRadius: radius.md,
   justifyContent: "center",
   alignItems: "center",
   width: "100%",
 },


 text: {
   fontSize: 16,
   fontWeight: "700",
 },


 pressed: {
   opacity: 0.8,
 },
});
