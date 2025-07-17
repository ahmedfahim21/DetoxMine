const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  expo: {
    name: IS_DEV ? 'DetoxMine (Dev)' : 'DetoxMine',
    slug: 'detoxmine',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: IS_DEV
        ? 'com.solana.mobile.expo.template.dev'
        : 'com.solana.mobile.expo.template',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: IS_DEV
        ? 'com.solana.mobile.expo.template.dev'
        : 'com.solana.mobile.expo.template',
      permissions: [
        'android.permission.PACKAGE_USAGE_STATS',
        'android.permission.QUERY_ALL_PACKAGES',
      ],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      eas: {
        projectId: 'd8cd811c-687b-4532-9e70-3cc3c5852055',
      },
    },
    plugins: [
      'expo-dev-client',
      [
        'expo-build-properties',
        {
          android: {
            compileSdkVersion: 34,
            targetSdkVersion: 34,
            buildToolsVersion: '34.0.0',
          },
        },
      ],
    ],
  },
};
