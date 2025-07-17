import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';

// Type definitions for the usage stats
interface AppUsageStats {
  packageName: string;
  appName: string;
  totalTimeInForeground: number;
  firstTimeStamp: number;
  lastTimeStamp: number;
  lastTimeUsed: number;
}

interface UsageStatsHook {
  usageStats: AppUsageStats[];
  totalScreenTime: number;
  isLoading: boolean;
  hasPermission: boolean;
  requestPermission: () => Promise<void>;
  refreshStats: () => Promise<void>;
  formatTime: (seconds: number) => string;
  debugInfo: () => void;
}

// Import the correct functions from the module
let EventFrequency: any = null;
let checkForPermission: any = null;
let queryUsageStats: any = null;
let showUsageAccessSettings: any = null;

// Dynamically import the module to handle cases where it might not be available
try {
  const UsageStatsModule = require('@brighthustle/react-native-usage-stats-manager');
  EventFrequency = UsageStatsModule.EventFrequency;
  checkForPermission = UsageStatsModule.checkForPermission;
  queryUsageStats = UsageStatsModule.queryUsageStats;
  showUsageAccessSettings = UsageStatsModule.showUsageAccessSettings;
  console.log('Usage stats module loaded successfully');
} catch (error) {
  console.warn('Usage stats manager not available:', error);
}

export const useUsageStats = (): UsageStatsHook => {
  const [usageStats, setUsageStats] = useState<AppUsageStats[]>([]);
  const [totalScreenTime, setTotalScreenTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  // Format time function
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    console.log('formatTime called with:', seconds, 'seconds');
    console.log('Calculated hours:', hours, 'minutes:', minutes, 'seconds:', remainingSeconds);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else if (remainingSeconds > 0) {
      return `${remainingSeconds}s`;
    } else {
      return '0s';
    }
  }, []);

  // Check if permission is granted
  const checkPermission = useCallback(async (): Promise<boolean> => {
    console.log('checkPermission called, checkForPermission available:', !!checkForPermission);
    
    if (!checkForPermission) {
      console.log('checkForPermission not available');
      return false;
    }

    try {
      const isGranted = await checkForPermission();
      console.log('Permission check result:', isGranted);
      setHasPermission(isGranted);
      return isGranted;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }, []);

  // Request usage stats permission
  const requestPermission = useCallback(async (): Promise<void> => {
    console.log('requestPermission called');
    console.log('checkForPermission available:', !!checkForPermission);
    console.log('showUsageAccessSettings available:', !!showUsageAccessSettings);
    
    if (!checkForPermission || !showUsageAccessSettings) {
      console.log('Required functions not available');
      Alert.alert(
        'Feature Unavailable',
        'Usage stats tracking is not available on this device. Make sure you have rebuilt the app with the native module.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const isAlreadyGranted = await checkPermission();
      console.log('Current permission status:', isAlreadyGranted);
      
      if (isAlreadyGranted) {
        Alert.alert(
          'Permission Already Granted',
          'Usage stats permission is already granted.',
          [{ text: 'OK' }]
        );
        return;
      }

      Alert.alert(
        'Permission Required',
        'DetoxMine needs access to usage stats to track your screen time and help you with digital wellness. You will be redirected to Settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Grant Permission',
            onPress: async () => {
              try {
                console.log('Opening usage access settings...');
                await showUsageAccessSettings('');
                // Check permission again after user returns from settings
                setTimeout(async () => {
                  console.log('Checking permission after settings return...');
                  const granted = await checkPermission();
                  if (granted) {
                    console.log('Permission granted, refreshing stats...');
                    refreshStats();
                  } else {
                    console.log('Permission still not granted');
                  }
                }, 1000);
              } catch (error) {
                console.error('Error opening settings:', error);
                Alert.alert(
                  'Error',
                  'Failed to open settings. Please try again.',
                  [{ text: 'OK' }]
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error in requestPermission:', error);
      Alert.alert(
        'Error',
        'Failed to request permission. Please try again.',
        [{ text: 'OK' }]
      );
    }
  }, [checkPermission]);

  // Fetch usage stats
  const refreshStats = useCallback(async (): Promise<void> => {
    if (!queryUsageStats || !EventFrequency) {
      return;
    }

    setIsLoading(true);
    
    try {
      const hasPermissionNow = await checkPermission();
      
      if (!hasPermissionNow) {
        setUsageStats([]);
        setTotalScreenTime(0);
        setIsLoading(false);
        return;
      }

      // Get stats for today (from midnight to now)
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const endTime = Date.now();
      const startTime = startOfToday.getTime();
      
      console.log('Querying usage stats for today...');
      console.log('Start time (midnight today):', new Date(startTime).toISOString());
      console.log('End time (now):', new Date(endTime).toISOString());
      console.log('EventFrequency:', EventFrequency?.INTERVAL_DAILY);

      const stats = await queryUsageStats(
        EventFrequency.INTERVAL_DAILY,
        startTime,
        endTime
      );
      
      console.log('Raw stats received:', stats);
      console.log('Stats type:', typeof stats);
      console.log('Stats is array:', Array.isArray(stats));
      
      if (stats && typeof stats === 'object') {
        // Convert object to array if it's an object with package names as keys
        let statsArray: AppUsageStats[] = [];
        
        if (Array.isArray(stats)) {
          statsArray = stats;
        } else {
          // Convert object to array
          statsArray = Object.values(stats);
          console.log('Converted object to array, length:', statsArray.length);
        }
        
        console.log('Number of raw apps:', statsArray.length);
        
        // Log first few apps to see the structure
        if (statsArray.length > 0) {
          console.log('First app data:', JSON.stringify(statsArray[0], null, 2));
          console.log('Sample app structure:');
          console.log('- packageName:', statsArray[0]?.packageName);
          console.log('- appName:', statsArray[0]?.appName);
          console.log('- totalTimeInForeground:', statsArray[0]?.totalTimeInForeground);
        }
        
        // Less restrictive filtering - let's see all apps first
        const allApps = statsArray
          .filter((app: AppUsageStats) => 
            app.totalTimeInForeground > 0 && // Any usage at all
            app.packageName && // Must have package name
            typeof app.totalTimeInForeground === 'number'
          )
          .sort((a: AppUsageStats, b: AppUsageStats) => 
            b.totalTimeInForeground - a.totalTimeInForeground
          );
          
        console.log('All apps with usage:', allApps.length);
        if (allApps.length > 0) {
          console.log('Top 3 apps by usage:');
          allApps.slice(0, 5).forEach((app: AppUsageStats, index: number) => {
            console.log(`${index + 1}. ${app.packageName}: ${app.totalTimeInForeground}s`);
          });
        }
        
        // Filter out system apps and apps with minimal usage
        const filteredStats = allApps
          .filter((app: AppUsageStats) => 
            app.totalTimeInForeground > 30000 && // Reduced to 30 seconds instead of 1 minute
            !app.packageName.includes('android.') &&
            !app.packageName.includes('com.android.') &&
            !app.packageName.includes('system') &&
            !app.packageName.includes('.launcher')
          )
          .slice(0, 10); // Top 10 apps

        console.log('Filtered apps:', filteredStats.length);
        
        // For debugging: if no apps after filtering, show top apps anyway
        let finalStats = filteredStats;
        if (filteredStats.length === 0 && allApps.length > 0) {
          console.log('No apps passed filtering, showing top 3 unfiltered for debugging');
          finalStats = allApps.slice(0, 5);
        }
        
        setUsageStats(finalStats);
        console.log('State set - usageStats:', finalStats);
        
        // Calculate total screen time from ALL apps, not just filtered ones
        const total = allApps.reduce(
          (sum: number, app: AppUsageStats) => sum + (app.totalTimeInForeground || 0),
          0
        );
        console.log('Total screen time calculated:', total);
        setTotalScreenTime(total);
        console.log('State set - totalScreenTime:', total);
      } else {
        console.log('No stats data or invalid format for today');
        setUsageStats([]);
        setTotalScreenTime(0);
      }
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      setUsageStats([]);
      setTotalScreenTime(0);
    } finally {
      setIsLoading(false);
    }
  }, [checkPermission]);

  // Debug function to check module status
  const debugInfo = useCallback(() => {
    console.log('=== DEBUG INFO ===');
    console.log('Module availability:');
    console.log('- EventFrequency:', !!EventFrequency);
    console.log('- checkForPermission:', !!checkForPermission);
    console.log('- queryUsageStats:', !!queryUsageStats);
    console.log('- showUsageAccessSettings:', !!showUsageAccessSettings);
    console.log('Current state:');
    console.log('- hasPermission:', hasPermission);
    console.log('- isLoading:', isLoading);
    console.log('- usageStats length:', usageStats.length);
    console.log('- usageStats data:', usageStats);
    console.log('- totalScreenTime:', totalScreenTime);
    
    if (EventFrequency) {
      console.log('EventFrequency values:', EventFrequency);
    }
    
    // Force a refresh to see if it works
    console.log('Forcing refresh...');
    refreshStats();
  }, [hasPermission, isLoading, usageStats, totalScreenTime, refreshStats]);

  // Initialize on mount
  useEffect(() => {
    checkPermission().then((granted) => {
      if (granted) {
        refreshStats();
      }
    });
  }, [checkPermission, refreshStats]);

  // Debug: Log state changes
  useEffect(() => {
    console.log('🔄 State updated - usageStats:', usageStats.length, 'items');
    console.log('🔄 State updated - totalScreenTime:', totalScreenTime);
    console.log('🔄 State updated - hasPermission:', hasPermission);
    console.log('🔄 State updated - isLoading:', isLoading);
  }, [usageStats, totalScreenTime, hasPermission, isLoading]);

  return {
    usageStats,
    totalScreenTime,
    isLoading,
    hasPermission,
    requestPermission,
    refreshStats,
    formatTime,
    debugInfo,
  };
};
