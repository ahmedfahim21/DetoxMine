import React, { useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, List, Divider, ActivityIndicator } from 'react-native-paper';
import { useUsageStats } from '../utils/useUsageStats';
import { useAppTheme } from '../theme';

export function UsageStatsScreen() {
  const theme = useAppTheme();
  const { 
    usageStats, 
    totalScreenTime, 
    isLoading, 
    hasPermission, 
    requestPermission, 
    refreshStats,
    formatTime,
    debugInfo
  } = useUsageStats();

  // Debug: Log what the screen is receiving
  React.useEffect(() => {
    console.log('📱 UsageStatsScreen received:');
    console.log('- usageStats:', usageStats.length, 'items');
    console.log('- totalScreenTime:', totalScreenTime);
    console.log('- hasPermission:', hasPermission);
    console.log('- isLoading:', isLoading);
  }, [usageStats, totalScreenTime, hasPermission, isLoading]);

  // Check if module is available by trying to access the hook
  const isModuleAvailable = React.useMemo(() => {
    try {
      require('@brighthustle/react-native-usage-stats-manager');
      return true;
    } catch {
      return false;
    }
  }, []);

  if (!isModuleAvailable) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card style={styles.card}>
          <Card.Content style={styles.permissionCard}>
            <Text variant="headlineSmall" style={{ textAlign: 'center', marginBottom: 16, color: theme.colors.error }}>
              Module Not Available
            </Text>
            <Text variant="bodyMedium" style={{ textAlign: 'center', marginBottom: 24 }}>
              The usage stats module is not properly installed. Please rebuild the app with the custom development client.
            </Text>
            <Text variant="bodySmall" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
              Run: npx expo run:android
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card style={styles.card}>
          <Card.Content style={styles.permissionCard}>
            <Text variant="headlineSmall" style={{ textAlign: 'center', marginBottom: 16 }}>
              Permission Required
            </Text>
            <Text variant="bodyMedium" style={{ textAlign: 'center', marginBottom: 24 }}>
              To view your usage statistics, we need permission to access your device's usage data.
            </Text>
            <Button
              mode="contained"
              onPress={requestPermission}
              icon="shield-check"
            >
              Grant Permission
            </Button>
            {__DEV__ && (
              <Button
                mode="text"
                onPress={debugInfo}
                style={{ marginTop: 8 }}
              >
                Debug Info
              </Button>
            )}
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Text variant="headlineSmall">Usage Statistics</Text>
            <Button
              mode="outlined"
              onPress={refreshStats}
              loading={isLoading}
              disabled={isLoading}
              icon="refresh"
            >
              Refresh
            </Button>
          </View>
          
          <Text variant="titleLarge" style={{ textAlign: 'center', marginVertical: 16 }}>
            Total Screen Time: {formatTime(totalScreenTime)} ({totalScreenTime}ms)
          </Text>
          
          <Divider style={{ marginVertical: 16 }} />
          
          <Text variant="titleMedium" style={{ marginBottom: 16 }}>
            App Usage Breakdown
          </Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text variant="bodyMedium" style={{ marginTop: 16, textAlign: 'center' }}>
                Loading usage data...
              </Text>
            </View>
          ) : usageStats.length > 0 ? (
            usageStats.map((app, index) => (
              <List.Item
                key={app.packageName}
                title={app.appName || app.packageName}
                description={`Used ${formatTime(app.totalTimeInForeground)}`}
                left={(props) => <List.Icon {...props} icon="cellphone" />}
                right={(props) => (
                  <Text {...props} variant="bodyMedium">
                    {totalScreenTime > 0 ? Math.round((app.totalTimeInForeground / totalScreenTime) * 100) : 0}%
                  </Text>
                )}
              />
            ))
          ) : (
            <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 32 }}>
              No usage data available for today
            </Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  permissionCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
});
