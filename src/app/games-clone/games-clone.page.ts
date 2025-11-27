import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonSkeletonText, IonCard, IonCardTitle, IonCardHeader,IonCol, IonRow,IonGrid } from '@ionic/angular/standalone';
import { Game } from '../services/game';
@Component({
  selector: 'app-games-clone',
  templateUrl: './games-clone.page.html',
  styleUrls: ['./games-clone.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSkeletonText, IonCard, IonCardTitle,IonCardHeader,IonCol,IonRow,IonGrid]
})
export class GamesClonePage implements OnInit {

  games: any[] = [];
  loading = true
  constructor(private gameService : Game) { }

  ngOnInit() {
    this.gameService.getGames().subscribe(data=>{
      this.games = data.results;
      this.loading = false;
    })
  }

}
