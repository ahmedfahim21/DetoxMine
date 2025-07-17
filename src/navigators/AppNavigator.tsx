/**
 * The main app navigator for DetoxMine - handles the authenticated user experience
 * after splash screen and login flow completion.
 */
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useColorScheme } from "react-native";
import * as Screens from "../screens";
import { HomeNavigator } from "./HomeNavigator";
import { StatusBar } from "expo-status-bar";
import {
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
} from "react-native-paper";
import { customLightColors, customDarkColors } from "../theme/colors";

/**
 * Navigation types for DetoxMine wellness platform
 * Defines the main app screens available after user authentication
 */

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Profile: undefined;
  Challenges: undefined;
  Rewards: undefined;
  Statistics: undefined;
  WellnessGoals: undefined;
  // Future wellness features can be added here
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// DetoxMine wellness platform navigation stack
const Stack = createNativeStackNavigator();

const AppStack = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? customDarkColors : customLightColors;

  return (
    <Stack.Navigator 
      initialRouteName={"Home"}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.onSurface,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: true,
      }}
    >
      <Stack.Screen
        name="HomeStack"
        component={HomeNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Settings" 
        component={Screens.SettingsScreen}
        options={{ 
          title: "Settings",
          headerStyle: {
            backgroundColor: colors.surface,
          },
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Screens.BlankScreen}
        options={{ 
          title: "My Profile",
          headerStyle: {
            backgroundColor: colors.surface,
          },
        }}
      />
      {/* Placeholder screens for future wellness features */}
      <Stack.Screen
        name="Challenges"
        component={Screens.BlankScreen}
        options={{ 
          title: "Wellness Challenges",
          headerStyle: {
            backgroundColor: colors.surface,
          },
        }}
      />
      <Stack.Screen
        name="Rewards"
        component={Screens.BlankScreen}
        options={{ 
          title: "My Rewards",
          headerStyle: {
            backgroundColor: colors.surface,
          },
        }}
      />
      <Stack.Screen
        name="Statistics"
        component={Screens.BlankScreen}
        options={{ 
          title: "Wellness Stats",
          headerStyle: {
            backgroundColor: colors.surface,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

/**
 * Main navigation container for DetoxMine wellness platform
 * Integrates custom theme with React Navigation and handles light/dark mode
 */
export const AppNavigator = (props: NavigationProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Adapt navigation themes to work with React Native Paper
  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  // Combine themes with our custom DetoxMine colors
  const CombinedDefaultTheme = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...LightTheme.colors,
      ...customLightColors,
      // Ensure DetoxMine background color is used consistently
      background: customLightColors.background,
      card: customLightColors.surface,
    },
  };
  
  const CombinedDarkTheme = {
    ...MD3DarkTheme,
    ...DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...DarkTheme.colors,
      ...customDarkColors,
      // Ensure DetoxMine background color is used consistently
      background: customDarkColors.background,
      card: customDarkColors.surface,
    },
  };

  const activeTheme = isDark ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    <NavigationContainer
      theme={activeTheme}
      {...props}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <AppStack />
    </NavigationContainer>
  );
};
