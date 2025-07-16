import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, Image, Linking } from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  Divider,
  Surface,
  Icon,
  ActivityIndicator 
} from 'react-native-paper';
import { useAppTheme } from '../theme';
import { useAuthorization } from '../utils/useAuthorization';
import { useMobileWallet } from '../utils/useMobileWallet';
import { alertAndLog } from '../utils/alertAndLog';

const { width } = Dimensions.get('window');

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const theme = useAppTheme();
  const { selectedAccount } = useAuthorization();
  const { connect, disconnect } = useMobileWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleWalletConnect = async () => {
    try {
      setIsConnecting(true);
      await connect();
      // If connection is successful and we have an account, proceed
      if (selectedAccount) {
        onLoginSuccess();
      }
    } catch (error) {
      alertAndLog('Connection failed', 'Failed to connect to wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      alertAndLog('Disconnection failed', 'Failed to disconnect wallet.');
    }
  };

  const handleDownloadWallet = () => {
    // Open Phantom wallet download page (most popular Solana mobile wallet)
    const walletUrl = 'https://phantom.app/download';
    Linking.openURL(walletUrl).catch(err => {
      alertAndLog('Error', 'Unable to open wallet download page. Please visit phantom.app in your browser.');
    });
  };

  // If already connected, show connected state
  if (selectedAccount) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text 
              variant="headlineMedium" 
              style={{ 
                color: theme.colors.primary,
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              Welcome to Your Journey!
            </Text>
            <Text 
              variant="bodyLarge" 
              style={{ 
                color: theme.colors.onSurfaceVariant,
                textAlign: 'center',
                marginTop: 8
              }}
            >
              Your wallet is connected and ready
            </Text>
          </View>

          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.successIcon}>
                <Icon 
                  source="check-circle" 
                  size={64} 
                  color={theme.colors.success} 
                />
              </View>
              
              <Text 
                variant="titleLarge" 
                style={{ 
                  color: theme.colors.onSurface,
                  textAlign: 'center',
                  marginBottom: 16
                }}
              >
                Ready for Wellness Challenges
              </Text>

              <Surface 
                style={[
                  styles.addressContainer, 
                  { backgroundColor: theme.colors.surfaceVariant }
                ]}
              >
                <Text 
                  variant="labelMedium" 
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Connected Address:
                </Text>
                <Text 
                  variant="bodyMedium" 
                  style={{ 
                    color: theme.colors.onSurface,
                    fontFamily: 'monospace'
                  }}
                >
                  {selectedAccount.address}
                </Text>
              </Surface>

              <Button
                mode="contained"
                onPress={onLoginSuccess}
                style={[{ backgroundColor: theme.colors.primary }]}
                labelStyle={{ color: theme.colors.onPrimary }}
                icon="rocket-launch"
              >
                Start My Wellness Journey
              </Button>

              <Button
                mode="outlined"
                onPress={handleDisconnect}
                style={[{ borderColor: theme.colors.outline }]}
                labelStyle={{ color: theme.colors.error }}
              >
                Disconnect Wallet
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </View>
    );
  }

  // Login/Connect state
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text 
            variant="headlineLarge" 
            style={{ 
              color: theme.colors.primary,
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            Get Started
          </Text>
          <Text 
            variant="bodyLarge" 
            style={{ 
              color: theme.colors.onSurfaceVariant,
              textAlign: 'center',
              marginTop: 12,
              lineHeight: 22
            }}
          >
            Sign in to begin your digital wellness journey and unlock rewards.
          </Text>
        </View>

        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.cardContent}>
            <View style={[styles.logoContainer]}>
              <Image 
                source={require('../../assets/icon.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text 
              variant="titleLarge" 
              style={{ 
                color: theme.colors.onSurface,
                textAlign: 'center',
                marginBottom: 6,
                fontWeight: '600'
              }}
            >
              DetoxMine
            </Text>


            <Divider style={{ marginVertical: 16 }} />

            {/* Features List */}
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Icon source="trophy" size={20} color={theme.colors.warning} />
                <Text 
                  variant="bodyMedium" 
                  style={{ color: theme.colors.onSurface, marginLeft: 12 }}
                >
                  Participate in wellness challenges
                </Text>
              </View>
              
              <View style={styles.featureItem}>
                <Icon source="chart-line" size={20} color={theme.colors.success} />
                <Text 
                  variant="bodyMedium" 
                  style={{ color: theme.colors.onSurface, marginLeft: 12 }}
                >
                  Track your digital habits & achievements
                </Text>
              </View>
              
              <View style={styles.featureItem}>
                <Icon source="gift" size={20} color={theme.colors.info} />
                <Text 
                  variant="bodyMedium" 
                  style={{ color: theme.colors.onSurface, marginLeft: 12 }}
                >
                  Claim crypto rewards for progress
                </Text>
              </View>
            </View>

            <Divider style={{ marginVertical: 16 }} />

            {/* Connect Button */}
            <Button
              mode="contained"
              onPress={handleWalletConnect}
              disabled={isConnecting}
              style={[{ backgroundColor: theme.colors.primary }]}
              labelStyle={{ color: theme.colors.onPrimary }}
              icon={isConnecting ? () => <ActivityIndicator size="small" color={theme.colors.onPrimary} /> : "wallet"}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>

            <Text 
              variant="labelSmall" 
              style={{ 
                color: theme.colors.onSurfaceVariant,
                textAlign: 'center',
                marginTop: 16,
                lineHeight: 18
              }}
            >
              Your privacy matters — your personal data stays on your device and only 
              your accomplishments are verified on-chain.
            </Text>
          </Card.Content>
        </Card>

        {/* Alternative Options */}
        <View style={styles.alternativeSection}>
          <Text 
            variant="titleMedium" 
            style={{ 
              color: theme.colors.onBackground,
              textAlign: 'center',
              marginBottom: 16
            }}
          >
            New to crypto wallets?
          </Text>
          
          <Button
            mode="outlined"
            onPress={handleDownloadWallet}
            labelStyle={{ color: theme.colors.onSurface }}
            icon="download"
          >
            Download Phantom Wallet
          </Button>
          
          <Text 
            variant="labelSmall" 
            style={{ 
              color: theme.colors.onSurfaceVariant,
              textAlign: 'center',
              marginTop: 8,
              paddingHorizontal: 16
            }}
          >
            Phantom is a secure and easy-to-use Solana wallet for mobile devices
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  card: {
    marginBottom: 24,
    elevation: 4,
  },
  cardContent: {
    padding: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alternativeSection: {
    alignItems: 'center',
    marginTop: 16,
  },
  successIcon: {
    alignItems: 'center',
    marginBottom: 16,
  },
  addressContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
});
