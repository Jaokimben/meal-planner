import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { colors } from "@/constants/colors";
import { Meal } from "@/types/meal";
import { ChevronRight } from "lucide-react-native";

interface MealCardProps {
  meal: Meal;
}

export const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  const getMealTypeIcon = () => {
    switch (meal.type) {
      case "breakfast":
        return "https://images.unsplash.com/photo-1533089860892-a9b9ac6cd6a4?q=80&w=2070&auto=format&fit=crop";
      case "lunch":
        return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop";
      case "dinner":
        return "https://images.unsplash.com/photo-1576402187878-974f70c890a5?q=80&w=2033&auto=format&fit=crop";
      default:
        return "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop";
    }
  };

  const formatMealType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.mealTypeContainer}>
          <Image
            source={{ uri: getMealTypeIcon() }}
            style={styles.mealTypeIcon}
            contentFit="cover"
          />
          <Text style={styles.mealType}>{formatMealType(meal.type)}</Text>
        </View>
        <Text style={styles.calories}>{meal.calories} kcal</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{meal.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {meal.description}
        </Text>
      </View>

      <View style={styles.nutritionInfo}>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{meal.protein}g</Text>
          <Text style={styles.nutritionLabel}>Protein</Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{meal.carbs}g</Text>
          <Text style={styles.nutritionLabel}>Carbs</Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{meal.fat}g</Text>
          <Text style={styles.nutritionLabel}>Fat</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>View Recipe</Text>
        <ChevronRight size={16} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
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
    marginBottom: 12,
  },
  mealTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mealTypeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  mealType: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  calories: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  content: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  nutritionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  nutritionItem: {
    alignItems: "center",
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  nutritionLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    marginRight: 4,
  },
});