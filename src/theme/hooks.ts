import { useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import type { CustomColors } from './colors';

// Extended theme type that includes custom colors
export type ExtendedTheme = MD3Theme & {
  colors: MD3Theme['colors'] & CustomColors;
};

// Custom hook to get theme with proper typing for custom colors
export const useAppTheme = (): ExtendedTheme => {
  const theme = useTheme<MD3Theme>();
  return theme as ExtendedTheme;
};

// Helper functions to work with theme colors
export const getContrastColor = (backgroundColor: string): string => {
  // Simple function to determine if text should be light or dark
  // based on background color luminance
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

// Helper to create themed styles
export const createThemedStyles = <T extends Record<string, any>>(
  styleFunction: (theme: ExtendedTheme) => T
) => {
  return (theme: ExtendedTheme) => styleFunction(theme);
};
