// Custom color definitions for the app
export const customLightColors = {
  // Primary colors (Red theme)
  primary: "#FF6B8A",
  primaryContainer: "#FFE6EA",
  onPrimary: "#ffffff",
  onPrimaryContainer: "#FF6B8A",

  // Secondary colors (Black theme)
  secondary: "#211409",
  secondaryContainer: "#211409",
  onSecondary: "#ffffff",
  onSecondaryContainer: "#ffffff",

  // Tertiary colors (Complementary warm tone)
  tertiary: "#D4841C",
  tertiaryContainer: "#FFF3E0",
  onTertiary: "#ffffff",
  onTertiaryContainer: "#D4841C",

  // Surface colors (Cream theme)
  surface: "#F9F3E9",
  surfaceVariant: "#F2EDE4",     // Slightly darker cream
  surfaceDisabled: "#EDE8DF",    // Muted cream
  onSurface: "#211409",          // Use secondary black for text
  onSurfaceVariant: "#5A4F3F",   // Brown-toned text
  onSurfaceDisabled: "#9E9388",  // Muted brown

  // Background
  background: "#F9F3E9",
  onBackground: "#211409",       // Use secondary black for text

  // Error colors (Adjusted to work with cream background)
  error: "#C62828",             // Darker red for errors
  errorContainer: "#FFEBEE",    // Light red container
  onError: "#ffffff",
  onErrorContainer: "#C62828",

  // Other colors (Adjusted for cream theme)
  outline: "#8B7355",           // Brown outline
  outlineVariant: "#D4C4B0",    // Light brown outline
  shadow: "#000000",
  scrim: "#000000",
  inverseSurface: "#2F2F2F",    // Dark surface for inverse
  inverseOnSurface: "#F9F3E9",  // Cream text on dark
  inversePrimary: "#FF6B8A",    // Light red for inverse
  backdrop: "rgba(33, 20, 9, 0.4)", // Semi-transparent overlay using your secondary color

  // Elevation levels (using cream-tinted surfaces)
  elevation: {
    level0: 'transparent',
    level1: '#FBF7F0',  // Very light cream tint
    level2: '#F8F4EC',  // Light cream tint
    level3: '#F6F1E8',  // Medium cream tint
    level4: '#F5F0E6',  // Slightly darker cream tint
    level5: '#F3EEE4',  // Darker cream tint
  },

  // Custom app-specific colors (Harmonized with theme)
  success: "#2E7D32",           // Forest green
  onSuccess: "#ffffff",
  successContainer: "#E8F5E8",  // Light green container
  onSuccessContainer: "#2E7D32",
  
  warning: "#ED6C02",           // Orange warning
  onWarning: "#ffffff",
  warningContainer: "#FFF3E0",  // Light orange container
  onWarningContainer: "#ED6C02",
  
  info: "#0288D1",              // Blue info
  onInfo: "#ffffff",
  infoContainer: "#E3F2FD",     // Light blue container
  onInfoContainer: "#0288D1",

  // Solana brand colors (kept original)
  solanaGreen: "#14f195",
  solanaPurple: "#9945ff",
  solanaGradientStart: "#9945ff",
  solanaGradientEnd: "#14f195",
};

export const customDarkColors = {
  // Primary colors (Red theme for dark mode)
  primary: "#FF6B8A",           // Lighter red for dark mode
  primaryContainer: "#B71C3C",  // Darker red container
  onPrimary: "#000000",
  onPrimaryContainer: "#FFE6EA",

  // Secondary colors (Light cream for dark mode)
  secondary: "#E8DDD1",         // Light cream for secondary in dark
  secondaryContainer: "#3A2E1E", // Dark brown container
  onSecondary: "#211409",
  onSecondaryContainer: "#E8DDD1",

  // Tertiary colors (Gold/orange for dark mode)
  tertiary: "#FFB74D",          // Light gold for dark mode
  tertiaryContainer: "#8B5A00",  // Dark gold container
  onTertiary: "#000000",
  onTertiaryContainer: "#FFF3E0",

  // Surface colors (Dark theme)
  surface: "#1A1A1A",           // Dark surface
  surfaceVariant: "#2D2D2D",    // Slightly lighter dark
  surfaceDisabled: "#262626",    // Disabled dark surface
  onSurface: "#E8DDD1",         // Light cream text
  onSurfaceVariant: "#C4B5A0",  // Muted cream text
  onSurfaceDisabled: "#666666",  // Disabled text

  // Background (Dark)
  background: "#121212",         // Pure dark background
  onBackground: "#E8DDD1",       // Light cream text

  // Error colors (Dark mode)
  error: "#FF6B6B",             // Lighter red for dark mode
  errorContainer: "#5D1A1A",    // Dark red container
  onError: "#000000",
  onErrorContainer: "#FFE6EA",

  // Other colors (Dark mode)
  outline: "#8B7355",           // Same brown outline
  outlineVariant: "#4A3F2F",    // Darker brown outline
  shadow: "#000000",
  scrim: "#000000",
  inverseSurface: "#F9F3E9",    // Light cream for inverse
  inverseOnSurface: "#211409",  // Dark text on light
  inversePrimary: "#E4023A",    // Original red for inverse
  backdrop: "rgba(0, 0, 0, 0.4)", // Semi-transparent dark overlay

  // Elevation levels (using dark surfaces)
  elevation: {
    level0: 'transparent',
    level1: '#1F1F1F',  // Very dark surface
    level2: '#232323',  // Dark surface
    level3: '#262626',  // Medium dark surface
    level4: '#2A2A2A',  // Slightly lighter dark surface
    level5: '#2E2E2E',  // Lighter dark surface
  },

  // Custom app-specific colors (Dark mode)
  success: "#66BB6A",           // Lighter green for dark
  onSuccess: "#000000",
  successContainer: "#1B5E20",  // Dark green container
  onSuccessContainer: "#E8F5E8",
  
  warning: "#FFB74D",           // Light orange for dark
  onWarning: "#000000",
  warningContainer: "#E65100",  // Dark orange container
  onWarningContainer: "#FFF3E0",
  
  info: "#64B5F6",              // Light blue for dark
  onInfo: "#000000",
  infoContainer: "#0D47A1",     // Dark blue container
  onInfoContainer: "#E3F2FD",

  // Solana brand colors (kept original for consistency)
  solanaGreen: "#14f195",
  solanaPurple: "#9945ff",
  solanaGradientStart: "#9945ff",
  solanaGradientEnd: "#14f195",
};

// Type definitions for custom colors (useful for TypeScript)
export type CustomColors = typeof customLightColors;

// Helper function to get colors based on theme
export const getCustomColors = (isDark: boolean): CustomColors => {
  return isDark ? customDarkColors : customLightColors;
};
