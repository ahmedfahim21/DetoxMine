import type { MD3Theme } from 'react-native-paper';

// Extend the default theme type to include custom colors
declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      // Custom semantic colors
      success: string;
      onSuccess: string;
      successContainer: string;
      onSuccessContainer: string;
      
      warning: string;
      onWarning: string;
      warningContainer: string;
      onWarningContainer: string;
      
      info: string;
      onInfo: string;
      infoContainer: string;
      onInfoContainer: string;

      // Solana brand colors
      solanaGreen: string;
      solanaPurple: string;
      solanaGradientStart: string;
      solanaGradientEnd: string;
    }
  }
}

export {};
