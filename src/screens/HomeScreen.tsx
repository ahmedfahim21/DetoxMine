import React, { useEffect } from "react";
import { StyleSheet, View, ScrollView, RefreshControl } from "react-native";
import { Text, Card, Chip, Button, Icon, Surface, ActivityIndicator } from "react-native-paper";

import { Section } from "../Section";
import { useAuthorization } from "../utils/useAuthorization";
import { AccountDetailFeature } from "../components/account/account-detail-feature";
import { SignInFeature } from "../components/sign-in/sign-in-feature";
import { useAppTheme } from "../theme";
import { useUsageStats } from "../utils/useUsageStats";

export function HomeScreen() {
  const { selectedAccount } = useAuthorization();
  const theme = useAppTheme();
  const { 
    totalScreenTime, 
    isLoading, 
    hasPermission, 
    requestPermission, 
    refreshStats, 
    formatTime,
    debugInfo 
  } = useUsageStats();

  // Request permission on mount if user is signed in
  useEffect(() => {
    console.log('HomeScreen mounted, selectedAccount:', !!selectedAccount, 'hasPermission:', hasPermission);
    // Commented out auto-request for testing
    // if (selectedAccount && !hasPermission) {
    //   // Auto-request permission when user is signed in
    //   setTimeout(() => {
    //     requestPermission();
    //   }, 1000); // Small delay to let the UI settle
    // }
  }, [selectedAccount, hasPermission, requestPermission]);

  return (
    <ScrollView 
      style={styles.screenContainer}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refreshStats}
          colors={[theme.colors.primary]}
        />
      }
    >
      <View style={styles.header}>
        <Text
          style={{ 
            fontWeight: "bold", 
            marginBottom: 8,
            color: theme.colors.primary,
            textAlign: 'center'
          }}
          variant="headlineMedium"
        >
          DetoxMine
        </Text>
        <Text
          style={{ 
            color: theme.colors.onSurfaceVariant,
            textAlign: 'center',
            marginBottom: 24
          }}
          variant="bodyLarge"
        >
          Your Digital Wellness Journey
        </Text>
      </View>

      {selectedAccount ? (
        <>
          {/* Welcome Back Section */}
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.welcomeHeader}>
                <Icon source="account-circle" size={40} color={theme.colors.primary} />
                <View style={styles.welcomeText}>
                  <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                    Welcome back!
                  </Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Ready to continue your wellness journey?
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Quick Stats */}
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.statsHeader}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                  Today's Progress
                </Text>
                {isLoading && (
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                )}
              </View>
              
              {!hasPermission ? (
                <View style={styles.permissionPrompt}>
                  <Icon source="shield-alert" size={32} color={theme.colors.warning} />
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, textAlign: 'center', marginVertical: 8 }}>
                    Enable usage tracking to see your screen time stats
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => {
                      console.log('Grant Permission button pressed');
                      requestPermission();
                    }}
                    style={{ backgroundColor: theme.colors.primary }}
                    labelStyle={{ color: theme.colors.onPrimary }}
                    icon="cog"
                  >
                    Grant Permission
                  </Button>
                  
                  {__DEV__ && (
                    <Button
                      mode="text"
                      onPress={() => {
                        console.log('Debug button pressed');
                        debugInfo();
                      }}
                      style={{ marginTop: 8 }}
                      labelStyle={{ color: theme.colors.onSurface }}
                    >
                      Debug Module Status
                    </Button>
                  )}
                </View>
              ) : (
                <View style={styles.statsContainer}>
                  <Surface style={[styles.statItem, { backgroundColor: theme.colors.successContainer }]}>
                    <Icon source="clock" size={24} color={theme.colors.success} />
                    <Text variant="labelSmall" style={{ color: theme.colors.onSuccessContainer, marginTop: 4 }}>
                      Screen Time
                    </Text>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSuccessContainer, fontWeight: 'bold' }}>
                      {totalScreenTime > 0 ? formatTime(totalScreenTime) : '0m'}
                    </Text>
                  </Surface>
                  
                  <Surface style={[styles.statItem, { backgroundColor: theme.colors.warningContainer }]}>
                    <Icon source="trophy" size={24} color={theme.colors.warning} />
                    <Text variant="labelSmall" style={{ color: theme.colors.onWarningContainer, marginTop: 4 }}>
                      Challenges
                    </Text>
                    <Text variant="titleMedium" style={{ color: theme.colors.onWarningContainer, fontWeight: 'bold' }}>
                      2 Active
                    </Text>
                  </Surface>
                  
                  <Surface style={[styles.statItem, { backgroundColor: theme.colors.infoContainer }]}>
                    <Icon source="coins" size={24} color={theme.colors.info} />
                    <Text variant="labelSmall" style={{ color: theme.colors.onInfoContainer, marginTop: 4 }}>
                      Rewards
                    </Text>
                    <Text variant="titleMedium" style={{ color: theme.colors.onInfoContainer, fontWeight: 'bold' }}>
                      12.5 SOL
                    </Text>
                  </Surface>
                </View>
              )}
            </Card.Content>
          </Card>

          {/* Quick Actions */}
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text variant="titleMedium" style={{ marginBottom: 16, color: theme.colors.onSurface, fontWeight: '600' }}>
                Quick Actions
              </Text>
              <View style={styles.actionButtons}>
                <Button
                  mode="contained"
                  style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                  labelStyle={{ color: theme.colors.onPrimary }}
                  icon="plus"
                  onPress={() => {}}
                >
                  New Challenge
                </Button>
                <Button
                  mode="outlined"
                  style={[styles.actionButton, { borderColor: theme.colors.outline }]}
                  labelStyle={{ color: theme.colors.onSurface }}
                  icon="chart-line"
                  onPress={() => {}}
                >
                  View Stats
                </Button>
              </View>
              
              {hasPermission && (
                <Button
                  mode="text"
                  style={{ marginTop: 8 }}
                  labelStyle={{ color: theme.colors.primary }}
                  icon="refresh"
                  onPress={refreshStats}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Refresh Usage Data
                </Button>
              )}
            </Card.Content>
          </Card>

          <AccountDetailFeature />
        </>
      ) : (
        <>
          {/* Feature Highlights */}
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text variant="titleLarge" style={{ marginBottom: 16, color: theme.colors.onSurface, fontWeight: '600' }}>
                Transform Your Digital Habits
              </Text>
              
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Surface style={[styles.featureIcon, { backgroundColor: theme.colors.successContainer }]}>
                    <Icon source="chart-line" size={24} color={theme.colors.success} />
                  </Surface>
                  <View style={styles.featureContent}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                      Track Progress
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                      Monitor your real screen time and app usage with detailed analytics
                    </Text>
                  </View>
                </View>
                
                <View style={styles.featureItem}>
                  <Surface style={[styles.featureIcon, { backgroundColor: theme.colors.warningContainer }]}>
                    <Icon source="trophy" size={24} color={theme.colors.warning} />
                  </Surface>
                  <View style={styles.featureContent}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                      Join Challenges
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                      Participate in community wellness challenges
                    </Text>
                  </View>
                </View>
                
                <View style={styles.featureItem}>
                  <Surface style={[styles.featureIcon, { backgroundColor: theme.colors.infoContainer }]}>
                    <Icon source="gift" size={24} color={theme.colors.info} />
                  </Surface>
                  <View style={styles.featureContent}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                      Earn Rewards
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                      Get crypto rewards for achieving your wellness goals
                    </Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>

          <SignInFeature />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    padding: 16,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  welcomeText: {
    marginLeft: 12,
    flex: 1,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  permissionPrompt: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statItem: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  featureContent: {
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
