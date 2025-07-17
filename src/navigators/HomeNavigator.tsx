import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { TopBar } from "../components/top-bar/top-bar-feature";
import { HomeScreen } from "../screens/HomeScreen";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "react-native-paper";
import BlankScreen from "../screens/BlankScreen";
import { UsageStatsScreen } from "../screens";

const Tab = createBottomTabNavigator();

/**
 * DetoxMine Bottom Tab Navigator
 * Main navigation for the wellness platform with wellness-focused tabs
 * 
 * Features:
 * - Home: Dashboard with progress and quick actions
 * - Challenges: Active wellness challenges
 * - Stats: Progress tracking and analytics
 * - Profile: User settings and account
 */
export function HomeNavigator() {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <TopBar />,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginVertical: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcon.glyphMap;
          
          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Challenges":
              iconName = focused ? "trophy" : "trophy-outline";
              break;
            case "Stats":
              iconName = focused ? "chart-line" : "chart-line-variant";
              break;
            case "Profile":
              iconName = focused ? "account-circle" : "account-circle-outline";
              break;
            default:
              iconName = "help-circle-outline";
          }

          return (
            <MaterialCommunityIcon
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen 
        name="Challenges" 
        component={BlankScreen}
        options={{
          tabBarLabel: "Challenges",
        }}
      />
      <Tab.Screen 
        name="Stats" 
        component={UsageStatsScreen}
        options={{
          tabBarLabel: "Stats",
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={BlankScreen}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}
