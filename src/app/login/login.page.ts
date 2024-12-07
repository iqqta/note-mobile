import { Component } from '@angular/core';
import { IonButton, IonLabel, IonIcon, IonText } from '@ionic/angular';
import { logoGoogle } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';  // Import Router

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  logoGoogle = logoGoogle;

  constructor(
    private authService: AuthService,
    private router: Router  // Injeksi Router ke dalam constructor
  ) {}

  async login() {
    try {
      await this.authService.loginWithGoogle();  // Melakukan login dengan Google
      this.router.navigate(['/home']);  // Redirect ke halaman home setelah berhasil login
    } catch (error) {
      console.error('Login failed:', error);  // Menangani error login
    }
  }
}
