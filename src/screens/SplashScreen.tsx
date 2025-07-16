import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useAppTheme } from '../theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const theme = useAppTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      
      <View style={styles.content}>
        {/* Logo/Icon area */}
        <View style={styles.logoContainer}>
          <View style={[styles.logoPlaceholder]}>
            <Image 
              source={require('../../assets/icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* App Name */}
        <View style={styles.titleContainer}>
          <Text 
            variant="headlineLarge" 
            style={{ 
              color: theme.colors.primary,
              fontWeight: 'bold',
              textAlign: 'center',
              letterSpacing: 0.5
            }}
          >
            DetoxMine
          </Text>
          <Text 
            variant="titleLarge" 
            style={{ 
              color: theme.colors.onBackground,
              textAlign: 'center',
              marginTop: 12,
              fontWeight: '600'
            }}
          >
            Elevate Your Digital Well-being
          </Text>
          <Text 
            variant="bodyLarge" 
            style={{ 
              color: theme.colors.onSurfaceVariant,
              textAlign: 'center',
              marginTop: 16,
              lineHeight: 24,
              paddingHorizontal: 8
            }}
          >
            Transform screen time into mindful moments. Track habits, join challenges, 
            and earn crypto rewards for healthier digital living.
          </Text>
          
        </View>

        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="large" 
            color={theme.colors.primary} 
          />
          <Text 
            variant="bodyMedium" 
            style={{ 
              color: theme.colors.onSurfaceVariant,
              marginTop: 16,
              textAlign: 'center',
              fontWeight: '500'
            }}
          >
            Setting up your wellness journey...
          </Text>
        </View>
      </View>

      {/* Bottom branding */}
      <View style={styles.bottomContainer}>
        <Text 
          variant="labelSmall" 
          style={{ 
            color: theme.colors.onSurfaceVariant,
            textAlign: 'center',
            opacity: 0.7,
            marginTop: 4
          }}
        >
          Secure • Safe • Decentralized
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 48,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    overflow: 'hidden',
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  titleContainer: {
    marginBottom: 64,
    alignItems: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  featureTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
