import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      try {
        GoogleAuth.initialize();
        console.log('GoogleAuth initialized successfully');
      } catch (error) {
        console.error('Error initializing GoogleAuth:', error);
      }
    });
  }
}