import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/stores/user-store";
import { useMealStore } from "@/stores/meal-store";
import { ChevronRight, User, Settings, LogOut, Heart, Info } from "lucide-react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { userProfile, clearUserProfile } = useUserStore();
  const { clearMeals } = useMealStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out? Your profile data will be cleared.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => {
            clearUserProfile();
            clearMeals();
            router.replace("/onboarding");
          },
        },
      ]
    );
  };

  const formatHealthIssues = () => {
    if (!userProfile?.healthIssues || userProfile.healthIssues.length === 0) {
      return "None";
    }
    return userProfile.healthIssues
      .map((issue) => issue.charAt(0).toUpperCase() + issue.slice(1).replace(/-/g, " "))
      .join(", ");
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <User size={40} color={colors.white} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>My Profile</Text>
            <Text style={styles.profileDetails}>
              {userProfile?.gender === "male" ? "Male" : "Female"}, {userProfile?.age} years
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>
                {userProfile?.gender === "male" ? "Male" : "Female"}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>{userProfile?.age} years</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Weight</Text>
              <Text style={styles.infoValue}>{userProfile?.weight} kg</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Height</Text>
              <Text style={styles.infoValue}>{userProfile?.height} cm</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health & Goals</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Goal</Text>
              <Text style={styles.infoValue}>
                {userProfile?.goal
                  ? userProfile.goal.charAt(0).toUpperCase() +
                    userProfile.goal.slice(1).replace(/-/g, " ")
                  : "Not set"}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Health Issues</Text>
              <Text style={styles.infoValue}>{formatHealthIssues()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                <Settings size={20} color={colors.textLight} />
                <Text style={styles.settingLabel}>Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.lightGray, true: colors.primaryLight }}
                thumbColor={notificationsEnabled ? colors.primary : "#f4f3f4"}
              />
            </View>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                <Heart size={20} color={colors.textLight} />
                <Text style={styles.settingLabel}>Dietary Preferences</Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                <Info size={20} color={colors.textLight} />
                <Text style={styles.settingLabel}>About</Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 14,
    color: colors.textLight,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.textLight,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  settingLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.error,
    marginLeft: 8,
  },
});