import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.neurocalm.app',
  appName: 'NeuroCalm',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
