import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService, NoteData } from '../services/firestore.service';
import { Timestamp } from 'firebase/firestore';
import { ReloadService } from '../services/reload.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-viewnote',
  templateUrl: './viewnote.page.html',
  styleUrls: ['./viewnote.page.scss'],
})
export class ViewnotePage implements OnInit {
  note: NoteData = {
    title: '',
    description: '',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  noteId: string | null = null;
  userAuthenticated: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private router: Router,
    private reloadService: ReloadService
  ) {}

  ngOnInit() {
    const auth = getAuth();

    // Check user authentication state on page load
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userAuthenticated = true; 
        this.route.paramMap.subscribe((params) => {
          this.noteId = params.get('id');
          if (this.noteId) {
            this.loadNote(); 
          } else {
            this.router.navigate(['/home']);
          }
        });
      } else {
        this.userAuthenticated = false; // User is not authenticated
        this.router.navigate(['/login']); // Redirect to login if not authenticated
      }
    });
  }

  // Load the note based on its ID
  async loadNote() {
    if (this.noteId) {
      try {
        this.note = await this.firestoreService.getNoteById(this.noteId);
      } catch (error) {
        console.error('Error loading note:', error);
        this.router.navigate(['/home']); // Redirect to home on error
      }
    } else {
      console.error('Invalid note ID:', this.noteId);
      this.router.navigate(['/home']); // Redirect to home if ID is invalid
    }
  }

  // Save the note (update or create)
  async saveNote() {
    if (this.noteId) {
      try {
        await this.firestoreService.updateNote(this.noteId, this.note);
        this.reloadService.triggerReload();
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error saving note:', error);
      }
    } else {
      try {
        await this.firestoreService.addNote(this.note);
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error saving note:', error);
      }
    }
  }
}
