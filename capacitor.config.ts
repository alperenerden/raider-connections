import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.raiderrash.app', // Change this to your own unique bundle ID
  appName: 'Raider Rash',
  webDir: 'dist',
  // Remove server config for production build
  // server: {
  //   url: 'https://d4182dbd-10fc-4a22-8f2a-e38e94fa94f0.lovableproject.com?forceHideBadge=true',
  //   cleartext: true
  // },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#000000'
    }
  }
};

export default config;