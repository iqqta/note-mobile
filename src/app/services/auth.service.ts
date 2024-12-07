import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) {}

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await this.afAuth.signInWithPopup(provider);  // Login dengan Google
      return result;
    } catch (error) {
      console.error('Login with Google failed:', error);
      throw error;
    }
  }
}
