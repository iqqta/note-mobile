import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'note-app',
  webDir: 'www',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'], // Scopes for Google Auth
      serverClientId: '60330969235-aci4v7etkvh6a0fd60661jiofrv8eq7d.apps.googleusercontent.com', // Replace with your actual server client ID
      forceCodeForRefreshToken: true // Optional: Set to true if you want to force the use of refresh tokens
    }
  }
};

export default config;