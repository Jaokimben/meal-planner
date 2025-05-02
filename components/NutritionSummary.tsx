import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { Meal } from "@/types/meal";

interface NutritionSummaryProps {
  meals: Meal[];
}

export const NutritionSummary: React.FC<NutritionSummaryProps> = ({ meals }) => {
  // Calculate total nutrition values
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  // Calculate percentages for the progress bars
  const proteinPercentage = (totalProtein * 4 / totalCalories) * 100; // 4 calories per gram of protein
  const carbsPercentage = (totalCarbs * 4 / totalCalories) * 100; // 4 calories per gram of carbs
  const fatPercentage = (totalFat * 9 / totalCalories) * 100; // 9 calories per gram of fat

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Nutrition</Text>
        <Text style={styles.calories}>{totalCalories} kcal</Text>
      </View>

      <View style={styles.macroContainer}>
        <View style={styles.macroItem}>
          <View style={styles.macroHeader}>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>{totalProtein}g</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(proteinPercentage, 100)}%`, backgroundColor: colors.primary },
              ]}
            />
          </View>
        </View>

        <View style={styles.macroItem}>
          <View style={styles.macroHeader}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroValue}>{totalCarbs}g</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(carbsPercentage, 100)}%`, backgroundColor: colors.secondary },
              ]}
            />
          </View>
        </View>

        <View style={styles.macroItem}>
          <View style={styles.macroHeader}>
            <Text style={styles.macroLabel}>Fat</Text>
            <Text style={styles.macroValue}>{totalFat}g</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(fatPercentage, 100)}%`, backgroundColor: "#FFA726" },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  calories: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  macroContainer: {
    gap: 12,
  },
  macroItem: {
    marginBottom: 8,
  },
  macroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  macroLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
});