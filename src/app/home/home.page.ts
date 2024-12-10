import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirestoreService, NoteData } from '../services/firestore.service';
import { MenuController } from '@ionic/angular';
import { ReloadService } from '../services/reload.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  notes: NoteData[] = []; // Semua catatan
  filteredNotes: NoteData[] = []; // Catatan hasil filter
  searchQuery: string = ''; // Query pencarian
  private reloadSub!: Subscription;
  fabOpen: boolean = false; // Status tombol FAB

  constructor(
    private firestoreService: FirestoreService,
    private router: Router,
    private reloadService: ReloadService,
    private menuController: MenuController
  ) {}

  ngOnInit() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.loadNotes();
        this.reloadSub = this.reloadService.reload$.subscribe(() => {
          this.loadNotes();
        });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  async loadNotes() {
    try {
      this.notes = await this.firestoreService.getNotes();
      this.filteredNotes = [...this.notes];
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }

  toggleFab() {
    console.log('Toggling FAB');
    this.fabOpen = !this.fabOpen; // Toggle status tombol FAB
    console.log('fabOpen:', this.fabOpen);
  }

  // Fungsi untuk filter kategori
  filterCategory(category: string) {
    if (category === 'all') {
      this.filteredNotes = [...this.notes]; // Tampilkan semua catatan
    } else if (category === 'favorite') {
      this.filteredNotes = this.notes.filter((note) => note.isFavorite); // Tampilkan catatan favorit
    } else {
      this.filteredNotes = this.notes.filter((note) => note.category === category); // Filter berdasarkan kategori lainnya
    }
    this.menuController.close();
  }  

  toggleFavorite(note: NoteData) {
    if (note) {
      note.isFavorite = !note.isFavorite; // Toggle status favorit
      if (note.id) {
        this.firestoreService.updateNote(note.id, { isFavorite: note.isFavorite }) // Perbarui di Firestore
          .then(() => {
            console.log(`Note ${note.id} updated with isFavorite: ${note.isFavorite}`);
          })
          .catch((error) => {
            console.error('Error updating favorite status:', error);
          });
      } else {
        console.error('Note id is undefined');
      }
    }
  }

  filterNotes() {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredNotes = this.notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        (note.description && note.description.toLowerCase().includes(query))
    );
  }

  viewNote(id: string) {
    if (id) {
      this.router.navigate(['/viewnote', id]);
    }
  }

  addNote() {
    this.router.navigate(['/create']);
  }

  addReminder() {
    this.router.navigate(['/creminder']);
  }

  async deleteNote(id: string | undefined) {
    if (id) {
      try {
        await this.firestoreService.deleteNote(id);
        this.loadNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  }

  ngOnDestroy() {
    if (this.reloadSub) {
      this.reloadSub.unsubscribe();
    }
  }
}
