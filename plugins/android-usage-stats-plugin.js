const { withAndroidManifest } = require('expo/config-plugins');

function addUsageStatsPermission(androidManifest) {
  if (!androidManifest.manifest.permission) {
    androidManifest.manifest.permission = [];
  }

  // Add PACKAGE_USAGE_STATS permission
  const usageStatsPermission = {
    $: {
      'android:name': 'android.permission.PACKAGE_USAGE_STATS',
    },
  };

  const queryAllPackagesPermission = {
    $: {
      'android:name': 'android.permission.QUERY_ALL_PACKAGES',
    },
  };

  // Check if permissions already exist
  const existingUsageStats = androidManifest.manifest['uses-permission']?.find(
    (perm) => perm.$['android:name'] === 'android.permission.PACKAGE_USAGE_STATS'
  );

  const existingQueryAll = androidManifest.manifest['uses-permission']?.find(
    (perm) => perm.$['android:name'] === 'android.permission.QUERY_ALL_PACKAGES'
  );

  if (!androidManifest.manifest['uses-permission']) {
    androidManifest.manifest['uses-permission'] = [];
  }

  if (!existingUsageStats) {
    androidManifest.manifest['uses-permission'].push(usageStatsPermission);
  }

  if (!existingQueryAll) {
    androidManifest.manifest['uses-permission'].push(queryAllPackagesPermission);
  }

  return androidManifest;
}

const withUsageStats = (config) => {
  return withAndroidManifest(config, (config) => {
    config.modResults = addUsageStatsPermission(config.modResults);
    return config;
  });
};

module.exports = withUsageStats;
