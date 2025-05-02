import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useUserStore } from "@/stores/user-store";
import { colors } from "@/constants/colors";

export default function IndexScreen() {
  const router = useRouter();
  const { isProfileComplete } = useUserStore();

  useEffect(() => {
    // Check if user has completed onboarding
    const checkOnboarding = async () => {
      if (isProfileComplete) {
        router.replace("/(tabs)");
      } else {
        router.replace("/onboarding");
      }
    };

    // Add a small delay for better UX
    const timer = setTimeout(() => {
      checkOnboarding();
    }, 1000);

    return () => clearTimeout(timer);
  }, [isProfileComplete, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});