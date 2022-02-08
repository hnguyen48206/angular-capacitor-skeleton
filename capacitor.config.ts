import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.testproject.app',
  appName: 'test-project',
  webDir: 'dist/testProject',
  bundledWebRuntime: false,
  server: {
    url: 'http://172.19.0.1:4200',
    cleartext: true
  },
};

export default config;
