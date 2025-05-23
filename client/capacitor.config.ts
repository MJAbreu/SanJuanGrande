import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sanjuangrande.app',
  appName: 'San Juan Grande',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: ['https://san-juan-grande-api.onrender.com/*'],
    cleartext: true
  },
  android: {
    iconPath: 'src/assets/logo-hospital-jerez.png',
    backgroundColor: '#ffffff'
  }
};

export default config;