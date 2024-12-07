// src/utils/firestore.service.ts
import { Injectable } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const auth = getAuth();
const db = getFirestore();

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';

// Interface data Note
export interface NoteData {
  id?: string;
  title: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  
  getTimestamp() {
    return Timestamp.now();
  }

  constructor() {}

  async getNoteById(id: string): Promise<NoteData> {
    const docRef = doc(this.getNote(), id);
    console.log('Document Reference:', docRef);
    const docSnapshot = await getDoc(docRef);
    console.log('Document Snapshot:', docSnapshot.exists() ? docSnapshot.data() : 'Not found');
    if (docSnapshot.exists()) {
      return docSnapshot.data() as NoteData;
    } else {
      throw new Error('Catatan tidak ditemukan');
    }
  }
  

  // Get reference to user's notes collection
  getNote() {
    const uid = auth.currentUser?.uid;
    console.log('Current User UID:', uid); // Debugging
    if (!uid) throw new Error('User not authenticated');
    return collection(db, 'users', uid, 'notes');
  }

  // Create new note
  async addNote(note: Omit<NoteData, 'id'>): Promise<string> {
    try {
      const noteRef = this.getNote();
      const docRef = await addDoc(noteRef, {
        ...note,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id; // Mengembalikan ID dokumen yang telah dibuat
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  }
  
  // Read all notes
  async getNotes(): Promise<NoteData[]> {
    try {
      const noteRef = this.getNote();
      const q = query(noteRef, orderBy('updatedAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()['createdAt'],
        updatedAt: doc.data()['updatedAt'],
      } as NoteData));
    } catch (error) {
      console.error('Error getting notes:', error);
      throw error;
    }
  }

  // Update note
  async updateNote(id: string, note: Partial<NoteData>): Promise<void> {
    try {
      const noteRef = this.getNote();
      const docRef = doc(noteRef, id);
      await updateDoc(docRef, {
        ...note,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  // Delete note
  async deleteNote(id: string): Promise<void> {
    try {
      const noteRef = this.getNote();
      const docRef = doc(noteRef, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }
}
