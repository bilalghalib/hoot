import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonSpinner,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { play, pause, heart, chatbubble, arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonSpinner,
    IonText,
  ],
})
export class FeedPage implements OnInit {
  hoots: any[] = [];
  loading = false;

  constructor(private router: Router) {
    addIcons({ play, pause, heart, chatbubble, arrowBack });
  }

  ngOnInit() {
    // TODO: Load hoots from API
    this.hoots = []; // Placeholder
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
