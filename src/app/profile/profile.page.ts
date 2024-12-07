import { Component, OnInit } from '@angular/core';
import { getAuth, User, onAuthStateChanged } from 'firebase/auth'; // Mengimpor Firebase Auth
import { Router } from '@angular/router'; // Untuk navigasi ke halaman edit profil

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  // Data profil pengguna
  userProfile = {
    avatarUrl: '', // Menyimpan URL avatar pengguna
    name: '', // Menyimpan nama pengguna
    email: '', // Menyimpan email pengguna
    bio: '', // Menyimpan bio pengguna
    location: '', // Menyimpan lokasi pengguna
  };

  constructor(private router: Router) { }

  ngOnInit() {
    this.checkAuthStatus(); // Memeriksa status autentikasi saat halaman di-load
  }

  // Fungsi untuk memeriksa status autentikasi dan memuat data profil pengguna
  checkAuthStatus() {
    const auth = getAuth();
    
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.loadUserProfile(user); // Memuat profil pengguna jika sudah terautentikasi
      } else {
        console.error('Pengguna tidak terautentikasi');
        this.router.navigate(['/login']); // Arahkan ke halaman login jika pengguna belum terautentikasi
      }
    });
  }

  // Fungsi untuk mengambil data profil pengguna dari Firebase Authentication
  loadUserProfile(user: User) {
    // Memuat data profil pengguna dari Firebase Auth
    this.userProfile.name = user.displayName || 'Nama Tidak Tersedia';
    this.userProfile.email = user.email || 'Email Tidak Tersedia';
    this.userProfile.avatarUrl = user.photoURL || 'https://www.example.com/default-avatar.jpg'; // Ganti dengan avatar default
    this.userProfile.bio = user.displayName || 'Tidak ada bio'; // Bisa disesuaikan
  }

  // Fungsi untuk mengedit profil (misalnya, menuju halaman edit profil)
  editProfile() {
    this.router.navigate(['/edit-profile']); // Jika Anda memiliki halaman untuk mengedit profil
  }
}
