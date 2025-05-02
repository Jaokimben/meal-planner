import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { colors } from "@/constants/colors";
import { useMealStore } from "@/stores/meal-store";
import { useUserStore } from "@/stores/user-store";
import { MealCard } from "@/components/MealCard";
import { NutritionSummary } from "@/components/NutritionSummary";
import { ChevronRight, RefreshCw } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function HomeScreen() {
  const { userProfile } = useUserStore();
  const { meals, generateMeals, isLoading } = useMealStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!meals.length) {
      generateMeals();
    }
  }, []);

  const handleRefresh = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setRefreshing(true);
    await generateMeals();
    setRefreshing(false);
  };

  const goalTitle = userProfile?.goal
    ? userProfile.goal.charAt(0).toUpperCase() + userProfile.goal.slice(1).replace(/-/g, " ")
    : "Healthy Eating";

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello!</Text>
            <Text style={styles.goalText}>Your goal: {goalTitle}</Text>
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              size={18}
              color={colors.primary}
              style={isLoading ? styles.rotating : undefined}
            />
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>
              Creating your personalized meal plan...
            </Text>
          </View>
        ) : (
          <>
            <NutritionSummary meals={meals} />

            <View style={styles.mealsSection}>
              <Text style={styles.sectionTitle}>Today's Meals</Text>

              {meals.map((meal) => (
                <MealCard key={meal.type} meal={meal} />
              ))}
            </View>

            <View style={styles.tipsSection}>
              <View style={styles.tipsHeader}>
                <Text style={styles.sectionTitle}>Nutrition Tips</Text>
                <TouchableOpacity style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>See all</Text>
                  <ChevronRight size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.tipCard}>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1932&auto=format&fit=crop",
                  }}
                  style={styles.tipImage}
                  contentFit="cover"
                />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Seasonal Eating Benefits</Text>
                  <Text style={styles.tipDescription}>
                    Eating seasonal produce ensures maximum nutrition and flavor while supporting
                    sustainable agriculture.
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  goalText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 4,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  refreshText: {
    color: colors.primary,
    fontWeight: "600",
    marginLeft: 6,
  },
  rotating: {
    transform: [{ rotate: "45deg" }],
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
  },
  mealsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: colors.text,
  },
  tipsSection: {
    marginTop: 32,
    marginBottom: 20,
  },
  tipsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    color: colors.primary,
    fontWeight: "600",
  },
  tipCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  tipImage: {
    width: "100%",
    height: 160,
  },
  tipContent: {
    padding: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: colors.text,
  },
  tipDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
});