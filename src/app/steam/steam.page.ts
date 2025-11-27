import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar, IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonButton } from '@ionic/angular/standalone';
import { GameCardComponent } from '../game-card/game-card.component';
import { Game } from '../services/game';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-steam',
  templateUrl: './steam.page.html',
  styleUrls: ['./steam.page.scss'],
    standalone: true,
    imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar, IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonButton, GameCardComponent]
})
  export class SteamPage implements OnInit, OnDestroy {

  games: any[] = [];
  loading = true;
  limit = 20;
  query = 'gt';
  genreFilter: string = 'all';
  sortBy: string = 'default';
  genres: string[] = [];
  skeletonSlots = new Array(12);
  activeOfferTab: string = 'specials';
  featuredGameIndex: number = 0;
  _filteredGames: any[] = [];

  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private gameService : Game, private router: Router) { }

  openExternalLink(url: string) {
    window.open(url, '_blank');
  }

  selectFeaturedGame(index: number) {
    this.featuredGameIndex = index;
  }

  get featuredGame() {
    return this.filteredGames[this.featuredGameIndex] || this.filteredGames[0];
  }

  filterByCategory(category: string) {
    this.activeOfferTab = category;
    
    this.featuredGameIndex = 0;
    
    this.sortBy = 'default';

    console.log('Filtering by category:', category);
    switch(category) {
      case 'bestsellers':
        this.query = 'gt'; 
        this.sortBy = 'rating';
        break;
      case 'new':
        this.query = 'gt'; 
        this.sortBy = 'year';
        break;
      case 'upcoming':
        this.query = 'upcoming';
        break;
      case 'specials':
        this.query = 'gt'; 
        this.sortBy = 'discount';
        break;
    }
    this.fetchGames();
  }

  ngOnInit() {
    this.search$
      .pipe(debounceTime(350), distinctUntilChanged())
      .subscribe(() => {
        this.limit = 20;
        this.fetchGames();
      });
    this.fetchGames();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchGames() {
    this.loading = true;
    this.gameService.getGames(this.query, this.limit).subscribe(data => {
      if (Array.isArray(data?.results)) {
        this.games = data.results;
      } else if (Array.isArray(data)) {
        this.games = data;
      } else {
        this.games = [];
      }
      this.extractGenres();
      this.updateFilteredGames();
      this.loading = false;
    });
  }

  loadMore(ev: any) {
    this.limit += 10;
    this.gameService.getGames(this.query, this.limit).subscribe(data => {
      if (Array.isArray(data?.results)) {
        this.games = data.results;
      } else if (Array.isArray(data)) {
        this.games = data;
      }
      this.extractGenres();
      this.updateFilteredGames();
      (ev.target as HTMLIonInfiniteScrollElement).complete();
    });
  }

  onSearch(ev: any) {
    const value = ev.detail?.value?.trim() || '';
    this.query = value.length ? value : 'gt';
    this.search$.next(this.query);
  }

  onGenreChange(ev: any) {
    this.genreFilter = ev.detail.value || 'all';
    this.updateFilteredGames();
  }

  onSortChange(ev: any) {
    this.sortBy = ev.detail.value || 'default';
    this.updateFilteredGames();
  }

  extractGenres() {
    const set = new Set<string>();
    for (const g of this.games) {
      const arr = Array.isArray(g?.genres) ? g.genres : [];
      arr.forEach((x: any) => {
        const name = x?.name || x;
        if (typeof name === 'string' && name.length < 25) set.add(name);
      });
    }
    this.genres = Array.from(set).sort();
  }

  updateFilteredGames() {
    this._filteredGames = this.calculateFilteredGames();
  }

  get filteredGames(): any[] {
    return this._filteredGames.length > 0 ? this._filteredGames : this.calculateFilteredGames();
  }

  calculateFilteredGames(): any[] {
    let result = this.games;
    if (this.genreFilter !== 'all') {
      result = result.filter(g => {
        const arr = Array.isArray(g?.genres) ? g.genres : [];
        const genre = g?.genre;
        return arr.some((x: any) => (x?.name || x) === this.genreFilter) || genre === this.genreFilter;
      });
    }
    if (this.sortBy !== 'default') {
      result = [...result];
      switch (this.sortBy) {
        case 'rating':
          result.sort((a, b) => {
            const rA = a?.rating?.mean ?? a?.rating ?? 0;
            const rB = b?.rating?.mean ?? b?.rating ?? 0;
            return rB - rA; 
          });
          break;
        case 'year':
          result.sort((a, b) => {
            const yA = a?.year ?? 0;
            const yB = b?.year ?? 0;
            return yB - yA;
          });
          break;
        case 'discount':
          result.sort((a, b) => {
            const dA = a?.discount_percent ?? a?.price_overview?.discount_percent ?? 0;
            const dB = b?.discount_percent ?? b?.price_overview?.discount_percent ?? 0;
            return dB - dA;
          });
          break;
      }
    }
    
    return result;
  }

  trackGame = (_: number, game: any) => game.id || game.name;

  openGame(game: any) {
    const id = game?.id || encodeURIComponent(game?.name || 'detalle');
    this.router.navigate(['/game', id], { state: { game } });
  }
}
