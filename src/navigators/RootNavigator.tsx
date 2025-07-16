import React, { useState, useEffect } from 'react';
import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { AppNavigator } from './AppNavigator';
import { useAuthorization } from '../utils/useAuthorization';

type AppState = 'splash' | 'login' | 'main';

export function RootNavigator() {
  const [appState, setAppState] = useState<AppState>('splash');
  const { selectedAccount, isLoading } = useAuthorization();

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setAppState('login');
  };

  // Handle successful login
  const handleLoginSuccess = () => {
    setAppState('main');
  };

  // Check if user is already authenticated
  useEffect(() => {
    if (!isLoading) {
      if (selectedAccount && appState === 'login') {
        setAppState('main');
      } else if (!selectedAccount && appState === 'main') {
        setAppState('login');
      }
    }
  }, [selectedAccount, isLoading, appState]);

  // Show splash screen first
  if (appState === 'splash') {
    return <SplashScreen onFinish={handleSplashComplete} />;
  }

  // Show login screen if not authenticated
  if (appState === 'login') {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Show main app if authenticated
  return <AppNavigator />;
}
