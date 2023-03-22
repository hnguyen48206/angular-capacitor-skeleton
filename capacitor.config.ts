import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ivms.vn',
  appName: 'ivms-mobile',
  webDir: 'dist',
  bundledWebRuntime: false,
  server:{
    cleartext:true
  }
};

export default config;
