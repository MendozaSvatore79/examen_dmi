import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonCard } from '@ionic/angular/standalone';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../services/game';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  templateUrl: './game-detail.page.html',
  styleUrls: ['./game-detail.page.scss'],
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonCard],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GameDetailPage implements OnInit {
  game: any;
  loading = true;

  constructor(private route: ActivatedRoute, private router: Router, private gameService: Game) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    this.game = nav?.extras?.state?.['game'];
    const id = this.route.snapshot.paramMap.get('id');

    if (this.game) {
      this.loading = false;
    } else if (id) {
      this.gameService.getGames(id, 1).subscribe(resp => {
        if (Array.isArray(resp?.results) && resp.results.length) {
          this.game = resp.results[0];
        } else if (Array.isArray(resp) && resp.length) {
          this.game = resp[0];
        }
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  }

  getImage(): string {
    if (!this.game) return '';
    return this.game.background_image || this.game.image || this.game.thumbnail || this.game.cover || '';
  }

  getGenres(): string {
    const arr = Array.isArray(this.game?.genres) ? this.game.genres : [];
    return arr.map((g: any) => g?.name || g).filter(Boolean).join(', ');
  }

  getDescription(): string {
    return this.game?.description || this.game?.short_description || 'Sin descripción disponible.';
  }

  getScreenshots(): any[] {
    const shots = this.game?.screenshots || this.game?.short_screenshots || [];
    if (Array.isArray(shots)) return shots;
    return [];
  }

  getScreenshotUrl(shot: any): string {
    return shot?.image || shot?.url || shot?.path_thumbnail || shot;
  }

  getYear(): string {
    const y = this.game?.year || this.game?.released || this.game?.release_date;
    if (!y) return '';
    if (typeof y === 'string') return y.substring(0, 4);
    if (typeof y === 'number') return String(Math.trunc(y));
    return '';
  }

  getGenreDisplay(): string {
    if (typeof this.game?.genre === 'string') {
      return this.game.genre;
    }
    const arr = Array.isArray(this.game?.genres) ? this.game.genres : [];
    return arr.map((g: any) => g?.name || g).filter(Boolean).join(', ');
  }

  getRatingMean(): string {
    const r = this.game?.rating;
    if (r == null) return '';
    if (typeof r === 'number') {
      const pct = Math.min(100, Math.round((r / 5) * 100));
      return pct + '%';
    }
    if (typeof r === 'object' && typeof r.mean === 'number') {
      const pct = Math.min(100, Math.round(r.mean * 100));
      return pct + '%';
    }
    return '';
  }

  getRatingCount(): number {
    const r = this.game?.rating;
    if (r && typeof r === 'object' && r.count != null) {
      return Number(r.count);
    }
    return 0;
  }

  isAdultOnly(): boolean {
    return !!this.game?.adult_only || !!this.game?.adult || !!this.game?.is_adult;
  }

  getExternalLink(): string {
    return this.game?.link || '';
  }

  openExternalLink() {
    const link = this.getExternalLink();
    if (link) {
      window.open(link, '_blank');
    }
  }

  getTags(): any[] {
    const raw = this.game?.tags;
    if (Array.isArray(raw)) return raw;
    return [];
  }

  getTagName(t: any): string {
    return t?.name || t?.title || String(t || '').trim();
  }

  trackTag = (_: number, t: any) => this.getTagName(t);

  back() {
    this.router.navigate(['/steam']);
  }
}
