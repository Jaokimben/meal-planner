import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { useMealStore } from "@/stores/meal-store";
import { MealCard } from "@/components/MealCard";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

export default function MealPlanScreen() {
  const { weeklyMeals, generateWeeklyMeals, isLoading } = useMealStore();
  const [selectedDay, setSelectedDay] = useState(0);

  // Generate days of the week starting from today
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      name: i === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      fullDate: date,
    };
  });

  const handleDayChange = (index: number) => {
    setSelectedDay(index);
    
    // If we don't have meals for this day yet, generate them
    if (!weeklyMeals[index] || weeklyMeals[index].length === 0) {
      generateWeeklyMeals(index);
    }
  };

  const currentDayMeals = weeklyMeals[selectedDay] || [];

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <View style={styles.calendarContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarScroll}
        >
          {daysOfWeek.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayItem,
                selectedDay === index && styles.selectedDayItem,
              ]}
              onPress={() => handleDayChange(index)}
            >
              <Text style={[
                styles.dayName,
                selectedDay === index && styles.selectedDayText,
              ]}>
                {day.name}
              </Text>
              <Text style={[
                styles.dayDate,
                selectedDay === index && styles.selectedDayText,
              ]}>
                {day.date}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.mealsContainer}>
        <Text style={styles.dateHeader}>
          {daysOfWeek[selectedDay].fullDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </Text>

        {isLoading && selectedDay !== 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>
              Creating your meal plan...
            </Text>
          </View>
        ) : (
          <>
            {currentDayMeals.length > 0 ? (
              currentDayMeals.map((meal) => (
                <MealCard key={meal.type} meal={meal} />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No meals planned for this day yet.
                </Text>
                <TouchableOpacity
                  style={styles.generateButton}
                  onPress={() => generateWeeklyMeals(selectedDay)}
                >
                  <Text style={styles.generateButtonText}>
                    Generate Meal Plan
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
  calendarContainer: {
    backgroundColor: colors.white,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  calendarScroll: {
    paddingHorizontal: 16,
  },
  dayItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: colors.lightGray,
    minWidth: 80,
  },
  selectedDayItem: {
    backgroundColor: colors.primary,
  },
  dayName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  dayDate: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  selectedDayText: {
    color: colors.white,
  },
  mealsContainer: {
    flex: 1,
    padding: 16,
  },
  dateHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: colors.text,
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: colors.white,
    borderRadius: 16,
    marginVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  generateButtonText: {
    color: colors.white,
    fontWeight: "600",
  },
});