import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonSkeletonText, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule, IonCard, IonSkeletonText, IonIcon],
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent implements OnChanges {
  @Input() game: any;
  @Input() loading: boolean = false;
  @Input() showGenres: boolean = true;
  @Input() showPrice: boolean = true;
  @Input() showWishlist: boolean = true;

  wishlist = false;
  private storageKey = 'wishlistIds';

  getImage(): string {
    if (!this.game) return '';
    return (
      this.game.background_image ||
      this.game.image ||
      this.game.thumbnail ||
      this.game.cover ||
      ''
    );
  }

  getName(): string {
    return this.game?.name || this.game?.title || 'Juego';
  }

  getGenres(): string {
    if (!this.showGenres) return '';
    // Accept either array of genres or single genre string/property
    const rawArray = this.game?.genres;
    if (Array.isArray(rawArray) && rawArray.length) {
      return rawArray
        .slice(0, 3)
        .map((g: any) => g?.name || g)
        .filter(Boolean)
        .join(', ');
    }
    if (typeof this.game?.genre === 'string') {
      return this.game.genre;
    }
    return '';
  }

  getYear(): string {
    const y = this.game?.year || this.game?.released || this.game?.release_date;
    if (!y) return '';
    if (typeof y === 'string') return y.substring(0, 4);
    if (typeof y === 'number') return String(Math.trunc(y));
    return '';
  }

  getRatingMean(): string {
    const r = this.game?.rating;
    if (r == null) return '';
    if (typeof r === 'number') {
      // assume 0..5 scale convert to percentage
      const pct = Math.min(100, Math.round((r / 5) * 100));
      return pct + '%';
    }
    if (typeof r === 'object' && typeof r.mean === 'number') {
      // mean usually 0..1 scale
      const pct = Math.min(100, Math.round(r.mean * 100));
      return pct + '%';
    }
    return '';
  }

  getRatingCount(): string {
    const r = this.game?.rating;
    if (r && typeof r === 'object' && r.count != null) {
      // Format count for readability (e.g., 1265 -> 1.3k)
      const count = Number(r.count);
      if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'k';
      }
      return count.toString();
    }
    return '';
  }

  isAdultOnly(): boolean {
    return !!this.game?.adult_only || !!this.game?.adult || !!this.game?.is_adult;
  }

  openLink(event: MouseEvent) {
    event.stopPropagation();
    if (this.game?.link) {
      window.open(this.game.link, '_blank');
    }
  }

  private priceOverview(): any {
    return this.game?.price_overview || this.game?.price || null;
  }

  getDiscountPercent(): number {
    const p = this.priceOverview();
    const discount = p?.discount_percent ?? this.game?.discount_percent ?? this.game?.discount;
    return typeof discount === 'number' ? discount : 0;
  }

  getFinalPrice(): string {
    if (!this.showPrice) return '';
    const p = this.priceOverview();
    return (
      p?.final_formatted ||
      p?.final ||
      p?.price_final ||
      p?.price ||
      this.game?.final_price ||
      (this.isFree() ? 'Gratis' : '')
    );
  }

  getOriginalPrice(): string {
    if (this.getDiscountPercent() === 0) return '';
    const p = this.priceOverview();
    return (
      p?.initial_formatted ||
      p?.initial ||
      p?.price_initial ||
      p?.original_price ||
      ''
    );
  }

  isFree(): boolean {
    const p = this.priceOverview();
    if (!p) return false;
    const finalVal = p.final ?? p.price_final ?? p.price ?? 0;
    return finalVal === 0;
  }

  toggleWishlist(): void {
    if (!this.showWishlist || this.loading) return;
    this.wishlist = !this.wishlist;
    const ids: any[] = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const id = this.game?.id || this.game?.name;
    if (!id) return;
    if (this.wishlist) {
      if (!ids.includes(id)) ids.push(id);
    } else {
      const idx = ids.indexOf(id);
      if (idx >= 0) ids.splice(idx, 1);
    }
    localStorage.setItem(this.storageKey, JSON.stringify(ids));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['game'] && this.game) {
      const ids: any[] = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const id = this.game?.id || this.game?.name;
      this.wishlist = id ? ids.includes(id) : false;
    }
  }
}
