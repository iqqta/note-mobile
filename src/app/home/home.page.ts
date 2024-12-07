import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirestoreService, NoteData } from '../services/firestore.service';
import { ReloadService } from '../services/reload.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Location } from '@angular/common'; // Import Location

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  notes: NoteData[] = []; // Variabel untuk menyimpan data catatan
  private reloadSub!: Subscription;
  userProfilePhoto: string | null = null; // Menyimpan URL foto profil pengguna

  constructor(
    private firestoreService: FirestoreService,
    private router: Router,
    private reloadService: ReloadService,
    private location: Location // Inject Location service
  ) {}

  ngOnInit() {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is logged in');
        this.loadNotes();
        this.userProfilePhoto = user.photoURL || null; // Ambil foto profil pengguna
        this.reloadSub = this.reloadService.reload$.subscribe(() => {
          this.loadNotes();
        });
      } else {
        console.error('User is not logged in');
        this.router.navigate(['/login']);
      }
    });
  }

  async loadNotes() {
    try {
      this.notes = await this.firestoreService.getNotes();
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }

  viewNote(id: string) {
    if (id) {
      this.router.navigate(['/viewnote', id]);
    }
  }

  addNote() {
    this.router.navigate(['/create']);
  }

  profile() {
    this.router.navigate(['/profile']);
  }

  async deleteNote(id: string | undefined) {
    if (id) {
      try {
        await this.firestoreService.deleteNote(id);
        this.loadNotes(); // Memuat ulang catatan setelah dihapus
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    } else {
      console.error('Invalid note ID');
      return;
    }
  }

  ngOnDestroy() {
    this.reloadSub.unsubscribe();
  }

  // Override the back button behavior to stay on the Home page
  canGoBack() {
    this.location.replaceState('/home'); // This will keep the user on the current page
  }
}
