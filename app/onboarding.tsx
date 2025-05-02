import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useUserStore } from "@/stores/user-store";
import { colors } from "@/constants/colors";
import { StatusBar } from "expo-status-bar";
import { ChevronRight, Check } from "lucide-react-native";
import { UserProfile } from "@/types/user";
import { goals, healthIssues } from "@/constants/user-data";

export default function OnboardingScreen() {
  const router = useRouter();
  const { setUserProfile } = useUserStore();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    gender: "",
    age: "",
    weight: "",
    height: "",
    goal: "",
    healthIssues: [],
  });

  const updateProfile = (key: keyof UserProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const toggleHealthIssue = (issue: string) => {
    setProfile((prev) => {
      const currentIssues = [...prev.healthIssues];
      if (currentIssues.includes(issue)) {
        return {
          ...prev,
          healthIssues: currentIssues.filter((i) => i !== issue),
        };
      } else {
        return { ...prev, healthIssues: [...currentIssues, issue] };
      }
    });
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save profile and navigate to main app
      setUserProfile(profile);
      router.replace("/(tabs)");
    }
  };

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return (
          profile.gender !== "" && 
          profile.age !== "" && 
          profile.weight !== "" && 
          profile.height !== ""
        );
      case 2:
        return profile.goal !== "";
      case 3:
        return true; // Health issues are optional
      default:
        return false;
    }
  };

  // For debugging purposes
  const debugStep = () => {
    console.log("Current step:", step);
    console.log("Profile:", profile);
    console.log("Step complete:", isStepComplete());
    
    // Force navigation to main app for testing
    setUserProfile({
      gender: profile.gender || "male",
      age: profile.age || "30",
      weight: profile.weight || "70",
      height: profile.height || "175",
      goal: profile.goal || "weight-loss",
      healthIssues: profile.healthIssues || [],
    });
    router.replace("/(tabs)");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Tell us about yourself</Text>
            <Text style={styles.stepDescription}>
              This helps us create personalized meal plans for you
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    profile.gender === "male" && styles.selectedOption,
                  ]}
                  onPress={() => updateProfile("gender", "male")}
                >
                  <Text
                    style={[
                      styles.optionText,
                      profile.gender === "male" && styles.selectedOptionText,
                    ]}
                  >
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    profile.gender === "female" && styles.selectedOption,
                  ]}
                  onPress={() => updateProfile("gender", "female")}
                >
                  <Text
                    style={[
                      styles.optionText,
                      profile.gender === "female" && styles.selectedOptionText,
                    ]}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Years"
                keyboardType="number-pad"
                value={profile.age}
                onChangeText={(value) => updateProfile("age", value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weight</Text>
              <TextInput
                style={styles.textInput}
                placeholder="kg"
                keyboardType="decimal-pad"
                value={profile.weight}
                onChangeText={(value) => updateProfile("weight", value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Height</Text>
              <TextInput
                style={styles.textInput}
                placeholder="cm"
                keyboardType="decimal-pad"
                value={profile.height}
                onChangeText={(value) => updateProfile("height", value)}
              />
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What is your goal?</Text>
            <Text style={styles.stepDescription}>
              Select the primary goal for your meal plan
            </Text>

            <ScrollView style={styles.goalsList}>
              {goals.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.goalItem,
                    profile.goal === goal.id && styles.selectedGoal,
                  ]}
                  onPress={() => updateProfile("goal", goal.id)}
                >
                  <View style={styles.goalContent}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalDescription}>{goal.description}</Text>
                  </View>
                  {profile.goal === goal.id && (
                    <Check color={colors.primary} size={20} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Any health concerns?</Text>
            <Text style={styles.stepDescription}>
              Select any health issues that apply to you (optional)
            </Text>

            <ScrollView style={styles.healthIssuesList}>
              {healthIssues.map((issue) => (
                <TouchableOpacity
                  key={issue.id}
                  style={[
                    styles.healthIssueItem,
                    profile.healthIssues.includes(issue.id) &&
                      styles.selectedHealthIssue,
                  ]}
                  onPress={() => toggleHealthIssue(issue.id)}
                >
                  <View style={styles.healthIssueContent}>
                    <Text style={styles.healthIssueTitle}>{issue.title}</Text>
                  </View>
                  {profile.healthIssues.includes(issue.id) && (
                    <Check color={colors.primary} size={20} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                s === step ? styles.activeDot : s < step ? styles.completedDot : {},
              ]}
            />
          ))}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {renderStep()}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.nextButton, !isStepComplete() && styles.disabledButton]}
            onPress={handleNext}
            disabled={!isStepComplete()}
          >
            <Text style={styles.nextButtonText}>
              {step === 3 ? "Finish" : "Continue"}
            </Text>
            <ChevronRight color="white" size={20} />
          </TouchableOpacity>
          
          {/* Skip button for testing */}
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={debugStep}
          >
            <Text style={styles.skipButtonText}>Skip to Main App</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 20,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.lightGray,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: colors.primary,
    width: 20,
  },
  completedDot: {
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: colors.text,
  },
  stepDescription: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: colors.text,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  optionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  optionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: "600",
  },
  goalsList: {
    maxHeight: 400,
  },
  goalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  selectedGoal: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  goalContent: {
    flex: 1,
    marginRight: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: colors.text,
  },
  goalDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  healthIssuesList: {
    maxHeight: 400,
  },
  healthIssueItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  selectedHealthIssue: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  healthIssueContent: {
    flex: 1,
    marginRight: 12,
  },
  healthIssueTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: colors.lightGray,
  },
  nextButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  skipButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: colors.secondaryLight,
    borderRadius: 12,
    alignItems: "center",
  },
  skipButtonText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: "600",
  },
});