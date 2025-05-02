import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";
import { Meal } from "@/types/meal";
import { useUserStore } from "./user-store";

interface MealState {
  meals: Meal[];
  weeklyMeals: Meal[][];
  isLoading: boolean;
  generateMeals: () => Promise<void>;
  generateWeeklyMeals: (dayIndex: number) => Promise<void>;
  clearMeals: () => void;
}

// Helper function to generate a meal based on user profile and goal
const generateMealBasedOnProfile = (mealType: string, userProfile: any) => {
  const goal = userProfile?.goal || "weight-loss";
  const healthIssues = userProfile?.healthIssues || [];
  
  // Base meal templates
  const mealTemplates = {
    breakfast: {
      "weight-loss": {
        name: "Greek Yogurt with Berries",
        description: "Low-fat Greek yogurt topped with fresh seasonal berries, a sprinkle of chia seeds, and a drizzle of honey.",
        calories: 320,
        protein: 20,
        carbs: 40,
        fat: 8,
      },
      "muscle-gain": {
        name: "Protein Oatmeal Bowl",
        description: "Steel-cut oats cooked with milk, mixed with protein powder, topped with banana, almond butter, and walnuts.",
        calories: 520,
        protein: 30,
        carbs: 60,
        fat: 15,
      },
      "better-digestion": {
        name: "Probiotic Smoothie Bowl",
        description: "Kefir-based smoothie with banana, papaya, and ginger topped with granola and flaxseeds.",
        calories: 380,
        protein: 15,
        carbs: 65,
        fat: 6,
      },
      "better-sleep": {
        name: "Cherry Almond Overnight Oats",
        description: "Oats soaked in almond milk with tart cherries, honey, and sliced almonds. Rich in melatonin for better sleep.",
        calories: 340,
        protein: 12,
        carbs: 55,
        fat: 10,
      },
      "more-energy": {
        name: "Energy-Boosting Breakfast Toast",
        description: "Whole grain toast topped with avocado, poached eggs, and a sprinkle of turmeric and black pepper.",
        calories: 420,
        protein: 18,
        carbs: 35,
        fat: 22,
      },
      "heart-health": {
        name: "Heart-Healthy Oatmeal",
        description: "Steel-cut oats with ground flaxseed, berries, and a small amount of walnuts for omega-3 fatty acids.",
        calories: 310,
        protein: 10,
        carbs: 45,
        fat: 12,
      },
    },
    lunch: {
      "weight-loss": {
        name: "Mediterranean Quinoa Salad",
        description: "Protein-rich quinoa with cucumber, cherry tomatoes, olives, feta cheese, and lemon-herb dressing.",
        calories: 420,
        protein: 15,
        carbs: 50,
        fat: 18,
      },
      "muscle-gain": {
        name: "Lean Protein Power Bowl",
        description: "Grilled chicken breast with brown rice, roasted vegetables, avocado, and a tahini dressing.",
        calories: 650,
        protein: 45,
        carbs: 65,
        fat: 20,
      },
      "better-digestion": {
        name: "Gut-Friendly Grain Bowl",
        description: "Well-cooked brown rice with steamed vegetables, lean turkey, and fermented kimchi on the side.",
        calories: 450,
        protein: 25,
        carbs: 55,
        fat: 12,
      },
      "better-sleep": {
        name: "Tryptophan-Rich Turkey Wrap",
        description: "Whole grain wrap with turkey, hummus, spinach, and roasted red peppers. Turkey contains tryptophan which helps with sleep.",
        calories: 480,
        protein: 30,
        carbs: 50,
        fat: 15,
      },
      "more-energy": {
        name: "Iron-Rich Spinach and Lentil Salad",
        description: "Lentils with baby spinach, roasted sweet potatoes, pumpkin seeds, and a lemon-olive oil dressing.",
        calories: 490,
        protein: 20,
        carbs: 60,
        fat: 16,
      },
      "heart-health": {
        name: "Salmon and Quinoa Bowl",
        description: "Baked salmon with quinoa, steamed broccoli, and a light lemon-dill sauce. Rich in omega-3 fatty acids.",
        calories: 520,
        protein: 35,
        carbs: 40,
        fat: 22,
      },
    },
    dinner: {
      "weight-loss": {
        name: "Baked White Fish with Vegetables",
        description: "Lightly seasoned white fish baked with lemon, served with steamed seasonal vegetables and a small portion of quinoa.",
        calories: 380,
        protein: 35,
        carbs: 30,
        fat: 10,
      },
      "muscle-gain": {
        name: "Grass-Fed Beef Stir Fry",
        description: "Lean beef strips stir-fried with bell peppers, broccoli, and snap peas, served over brown rice.",
        calories: 720,
        protein: 50,
        carbs: 70,
        fat: 25,
      },
      "better-digestion": {
        name: "Gentle Vegetable Soup with Chicken",
        description: "Clear broth soup with well-cooked vegetables, shredded chicken, and ginger for digestive comfort.",
        calories: 320,
        protein: 25,
        carbs: 30,
        fat: 8,
      },
      "better-sleep": {
        name: "Magnesium-Rich Dinner Plate",
        description: "Baked salmon with roasted sweet potatoes and steamed spinach. Rich in magnesium which helps with sleep quality.",
        calories: 450,
        protein: 30,
        carbs: 40,
        fat: 18,
      },
      "more-energy": {
        name: "Balanced Protein and Complex Carb Plate",
        description: "Herb-roasted chicken breast with sweet potato, steamed broccoli, and a small side of quinoa.",
        calories: 520,
        protein: 40,
        carbs: 45,
        fat: 15,
      },
      "heart-health": {
        name: "Mediterranean Vegetable and Bean Stew",
        description: "Tomato-based stew with a variety of vegetables, beans, and herbs. Served with a small portion of whole grain bread.",
        calories: 380,
        protein: 18,
        carbs: 60,
        fat: 8,
      },
    },
  };

  // Adjust meal based on health issues
  let meal = { ...mealTemplates[mealType][goal], type: mealType };
  
  // Apply modifications based on health issues
  if (healthIssues.includes("diabetes")) {
    meal.carbs = Math.round(meal.carbs * 0.7); // Reduce carbs
    meal.calories = Math.round(meal.calories - (meal.carbs * 0.3 * 4)); // Adjust calories
    meal.description = "Low glycemic index: " + meal.description;
  }
  
  if (healthIssues.includes("hypertension")) {
    meal.description = "Low sodium: " + meal.description;
  }
  
  if (healthIssues.includes("gluten-intolerance")) {
    meal.description = "Gluten-free: " + meal.description.replace("whole grain", "gluten-free grain");
  }
  
  if (healthIssues.includes("lactose-intolerance")) {
    meal.description = meal.description.replace("Greek yogurt", "coconut yogurt")
      .replace("milk", "almond milk")
      .replace("cheese", "dairy-free cheese");
  }

  // Add some randomness to make meals feel different each time
  meal.calories = Math.round(meal.calories * (0.9 + Math.random() * 0.2));
  meal.protein = Math.round(meal.protein * (0.9 + Math.random() * 0.2));
  meal.carbs = Math.round(meal.carbs * (0.9 + Math.random() * 0.2));
  meal.fat = Math.round(meal.fat * (0.9 + Math.random() * 0.2));
  
  return meal;
};

export const useMealStore = create<MealState>()(
  persist(
    (set, get) => ({
      meals: [],
      weeklyMeals: [[], [], [], [], [], [], []],
      isLoading: false,
      
      generateMeals: async () => {
        set({ isLoading: true });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const userProfile = useUserStore.getState().userProfile;
          
          const newMeals = [
            generateMealBasedOnProfile("breakfast", userProfile),
            generateMealBasedOnProfile("lunch", userProfile),
            generateMealBasedOnProfile("dinner", userProfile),
          ];
          
          set({ 
            meals: newMeals,
            weeklyMeals: [[...newMeals], ...get().weeklyMeals.slice(1)],
            isLoading: false 
          });
        } catch (error) {
          console.error("Error generating meals:", error);
          set({ isLoading: false });
        }
      },
      
      generateWeeklyMeals: async (dayIndex) => {
        if (dayIndex === 0) {
          return get().generateMeals();
        }
        
        set({ isLoading: true });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const userProfile = useUserStore.getState().userProfile;
          
          const newMeals = [
            generateMealBasedOnProfile("breakfast", userProfile),
            generateMealBasedOnProfile("lunch", userProfile),
            generateMealBasedOnProfile("dinner", userProfile),
          ];
          
          const updatedWeeklyMeals = [...get().weeklyMeals];
          updatedWeeklyMeals[dayIndex] = newMeals;
          
          set({ 
            weeklyMeals: updatedWeeklyMeals,
            isLoading: false 
          });
        } catch (error) {
          console.error("Error generating weekly meals:", error);
          set({ isLoading: false });
        }
      },
      
      clearMeals: () => {
        set({ 
          meals: [],
          weeklyMeals: [[], [], [], [], [], [], []],
        });
      },
    }),
    {
      name: "meal-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);