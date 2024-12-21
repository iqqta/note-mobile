import { Injectable } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private platform: Platform
  ) {
    // Initialize GoogleAuth only if on a mobile device (Capacitor platform)
    this.initializeGoogleAuth();
  }

  // Initialize GoogleAuth
  private initializeGoogleAuth() {
    if (this.platform.is('capacitor')) {
      GoogleAuth.initialize({
        clientId: '60330969235-aci4v7etkvh6a0fd60661jiofrv8eq7d.apps.googleusercontent.com', // Replace with your client ID
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      }).catch(err => {
        console.error('Error initializing GoogleAuth:', err);
      });
    }
  }

  async loginWithGoogle() {
    try {
      if (this.platform.is('capacitor')) {
        const googleUser = await GoogleAuth.signIn();
        const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
        const result = await this.afAuth.signInWithCredential(credential);
        console.log('User signed in:', result.user); // Debugging
        return result;
      } else {
        console.log('Google login is not supported on the web');
        return null;
      }
    } catch (error) {
      console.error('Login with Google failed:', error);
      throw error;
    }
  }
  
}
