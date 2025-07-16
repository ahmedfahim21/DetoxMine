import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, Card, Chip } from "react-native-paper";

import { Section } from "../Section";
import { useAuthorization } from "../utils/useAuthorization";
import { AccountDetailFeature } from "../components/account/account-detail-feature";
import { SignInFeature } from "../components/sign-in/sign-in-feature";
import { useAppTheme } from "../theme";

export function HomeScreen() {
  const { selectedAccount } = useAuthorization();
  const theme = useAppTheme();

  return (
    <View style={styles.screenContainer}>
      <Text
        style={{ fontWeight: "bold", marginBottom: 12 }}
        variant="displaySmall"
      >
        Solana Mobile Expo Template
      </Text>
      
      {/* Demo of custom theme colors */}
      <Card style={[styles.themeDemo, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>
            Custom Theme Colors
          </Text>
          <View style={styles.chipContainer}>
            <Chip 
              style={[styles.chip, { backgroundColor: theme.colors.success }]}
              textStyle={{ color: theme.colors.onSuccess }}
            >
              Success
            </Chip>
            <Chip 
              style={[styles.chip, { backgroundColor: theme.colors.warning }]}
              textStyle={{ color: theme.colors.onWarning }}
            >
              Warning
            </Chip>
            <Chip 
              style={[styles.chip, { backgroundColor: theme.colors.info }]}
              textStyle={{ color: theme.colors.onInfo }}
            >
              Info
            </Chip>
          </View>
          <View style={styles.solanaColors}>
            <View style={[styles.colorBox, { backgroundColor: theme.colors.solanaGreen }]} />
            <View style={[styles.colorBox, { backgroundColor: theme.colors.solanaPurple }]} />
            <Text variant="bodySmall">Solana Brand Colors</Text>
          </View>
        </Card.Content>
      </Card>

      {selectedAccount ? (
        <AccountDetailFeature />
      ) : (
        <>
          <Section
            title="Solana SDKs"
            description="Configured with Solana SDKs like Mobile Wallet Adapter and web3.js."
          />
          <Section
            title="UI Kit and Navigation"
            description="Utilizes React Native Paper components and the React Native Navigation library."
          />
          <Section
            title="Get started!"
            description="Connect or Sign in with Solana (SIWS) to link your wallet account."
          />
          <SignInFeature />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    padding: 16,
    flex: 1,
  },
  buttonGroup: {
    flexDirection: "column",
    paddingVertical: 4,
  },
  themeDemo: {
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    marginRight: 4,
  },
  solanaColors: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
});
