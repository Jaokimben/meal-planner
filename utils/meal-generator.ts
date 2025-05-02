import { Platform } from "react-native";
import { UserProfile } from "@/types/user";
import { Meal } from "@/types/meal";

export async function generateMealPlan(userProfile: UserProfile | null): Promise<Meal[]> {
  if (!userProfile) {
    throw new Error("User profile is required to generate meal plan");
  }

  try {
    // Create a prompt based on user profile
    const prompt = createMealPlanPrompt(userProfile);
    
    // Call AI API to generate meal plan
    const response = await fetchMealPlanFromAI(prompt);
    
    // Parse the response into meal objects
    return parseMealPlanResponse(response);
  } catch (error) {
    console.error("Error in meal plan generation:", error);
    throw error;
  }
}

function createMealPlanPrompt(profile: UserProfile): string {
  const { gender, age, weight, height, goal, healthIssues } = profile;
  
  let healthIssuesText = "";
  if (healthIssues && healthIssues.length > 0) {
    healthIssuesText = `Health concerns: ${healthIssues.join(", ")}.`;
  }
  
  return `Create a daily meal plan (breakfast, lunch, dinner) for a ${gender}, ${age} years old, ${weight}kg, ${height}cm. 
  Their goal is ${goal.replace(/-/g, " ")}. ${healthIssuesText}
  Focus on seasonal, nutritious foods. For each meal, include:
  - Name
  - Brief description
  - Calories
  - Macros (protein, carbs, fat, fiber)
  - List of ingredients
  - A nutrition tip related to the meal
  
  Format as JSON.`;
}

async function fetchMealPlanFromAI(prompt: string): Promise<string> {
  try {
    const response = await fetch("https://toolkit.rork.com/text/llm/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are a nutrition expert and meal planner. Respond with detailed, nutritionally balanced meal plans based on user goals and health needs. Always format your response as valid JSON that can be parsed.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.completion;
  } catch (error) {
    console.error("Error fetching from AI API:", error);
    throw error;
  }
}

function parseMealPlanResponse(response: string): Meal[] {
  try {
    // Extract JSON from the response
    let jsonStr = response;
    
    // If the response contains markdown code blocks, extract the JSON
    if (response.includes("```json")) {
      const match = response.match(/```json\n([\s\S]*?)\n```/);
      if (match && match[1]) {
        jsonStr = match[1];
      }
    } else if (response.includes("```")) {
      const match = response.match(/```\n([\s\S]*?)\n```/);
      if (match && match[1]) {
        jsonStr = match[1];
      }
    }
    
    // Parse the JSON
    const parsed = JSON.parse(jsonStr);
    
    // Handle different possible response formats
    let meals: Meal[] = [];
    
    if (Array.isArray(parsed)) {
      meals = parsed;
    } else if (parsed.meals && Array.isArray(parsed.meals)) {
      meals = parsed.meals;
    } else if (parsed.breakfast || parsed.lunch || parsed.dinner) {
      // Handle object with meal types as keys
      if (parsed.breakfast) meals.push({ ...parsed.breakfast, type: "breakfast" });
      if (parsed.lunch) meals.push({ ...parsed.lunch, type: "lunch" });
      if (parsed.dinner) meals.push({ ...parsed.dinner, type: "dinner" });
      if (parsed.snack) meals.push({ ...parsed.snack, type: "snack" });
    }
    
    // Add default image URLs if missing
    return meals.map(meal => ({
      ...meal,
      imageUrl: meal.imageUrl || getDefaultMealImage(meal.type),
    }));
  } catch (error) {
    console.error("Error parsing meal plan response:", error);
    throw new Error("Failed to parse meal plan data");
  }
}

function getDefaultMealImage(mealType: string): string {
  switch (mealType) {
    case "breakfast":
      return "https://images.unsplash.com/photo-1533089860892-a9b9ac6cd6b4?q=80&w=1470&auto=format&fit=crop";
    case "lunch":
      return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop";
    case "dinner":
      return "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1458&auto=format&fit=crop";
    case "snack":
      return "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=1374&auto=format&fit=crop";
    default:
      return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop";
  }
}