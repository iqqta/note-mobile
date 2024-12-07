import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService, NoteData } from '../services/firestore.service';
import { ReloadService } from '../services/reload.service';

@Component({
  selector: 'app-create-note',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage {
  noteTitle: string = '';
  noteDescription: string = '';

  constructor(
    private router: Router,
    private firestoreService: FirestoreService, 
    private reloadService: ReloadService 
  ) {}

  async addNote() {
    if (this.noteTitle && this.noteDescription) {
      const newNote: Omit<NoteData, 'id'> = {
        title: this.noteTitle,
        description: this.noteDescription,
        createdAt: this.firestoreService.getTimestamp(),
        updatedAt: this.firestoreService.getTimestamp(),
      };

      try {
        const noteId = await this.firestoreService.addNote(newNote);
        console.log('Catatan baru disimpan dengan ID:', noteId);

        this.reloadService.triggerReload();
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error saat menyimpan catatan:', error);
      }
    } else {
      // Jika ada input yang kosong
      alert('Judul dan deskripsi catatan tidak boleh kosong');
    }
  }
}
