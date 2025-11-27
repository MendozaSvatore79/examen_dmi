
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton
} from '@ionic/angular/standalone';
import { Game } from '../services/game';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton
  ],
})
export class HomePage implements OnInit {
  private gameService = inject(Game);
  private router = inject(Router);

  games: any[] = [];
  loading = true;
  totalGames = 0;
  featuredGames = 0;
  newGames = 0;
  topFeaturedGames: any[] = [];
  categoryCounts: { [key: string]: number } = {};

  constructor() {}

  ngOnInit() {
    this.gameService.getGames('gt', 100).subscribe((resp) => {
      this.games = resp?.results || resp || [];
      this.totalGames = this.games.length;
      this.featuredGames = this.games.filter(g => g?.rating?.mean > 0.8).length;
      this.newGames = this.games.filter(g => g?.year >= 2023).length;
      this.topFeaturedGames = this.games
        .filter(g => g?.rating?.mean > 0.75 && g?.images?.headerImage)
        .sort((a, b) => (b.rating?.mean || 0) - (a.rating?.mean || 0))
        .slice(0, 4);
      this.calculateCategoryCounts();
      
      this.loading = false;
    });
  }

  calculateCategoryCounts() {
    const categories = ['action', 'adventure', 'rpg', 'strategy'];
    categories.forEach(cat => {
      this.categoryCounts[cat] = this.games.filter(g => 
        g?.genres?.some((genre: any) => 
          genre?.name?.toLowerCase().includes(cat)
        )
      ).length;
    });
  }

  navigateToStore() {
    this.router.navigate(['/steam']);
  }

  navigateToCategory(category: string) {
    this.router.navigate(['/steam'], { queryParams: { category } });
  }

  getCategoryCount(category: string): number {
    return this.categoryCounts[category] || 0;
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}
