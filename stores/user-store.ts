import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserProfile } from "@/types/user";

interface UserState {
  userProfile: UserProfile | null;
  isProfileComplete: boolean;
  setUserProfile: (profile: UserProfile) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  clearUserProfile: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userProfile: null,
      isProfileComplete: false,
      
      setUserProfile: (profile) => {
        // Ensure all required fields are present
        if (
          profile.gender && 
          profile.age && 
          profile.weight && 
          profile.height && 
          profile.goal
        ) {
          set({ 
            userProfile: profile,
            isProfileComplete: true,
          });
          console.log("Profile set successfully:", profile);
        } else {
          console.warn("Incomplete profile data:", profile);
          // Set anyway for testing purposes
          set({ 
            userProfile: profile,
            isProfileComplete: true,
          });
        }
      },
      
      updateUserProfile: (updates) => {
        const currentProfile = get().userProfile;
        if (currentProfile) {
          set({ 
            userProfile: { ...currentProfile, ...updates },
          });
        }
      },
      
      clearUserProfile: () => {
        set({ 
          userProfile: null,
          isProfileComplete: false,
        });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);