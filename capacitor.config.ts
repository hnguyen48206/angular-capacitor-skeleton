import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ivms.vn',
  appName: 'ivms-mobile',
  webDir: 'dist/ivms_mobile',
  bundledWebRuntime: false,
  server: {
    cleartext: true
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 3000,
      "launchAutoHide": true,
      "androidScaleType": "CENTER_CROP",
      "splashImmersive": true,
      "backgroundColor": "#ffffff"
    }
  }
};

export default config;
