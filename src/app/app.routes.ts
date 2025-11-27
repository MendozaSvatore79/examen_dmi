import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'message/:id',
    loadComponent: () =>
      import('./view-message/view-message.page').then((m) => m.ViewMessagePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'steam',
    loadComponent: () => import('./steam/steam.page').then( m => m.SteamPage)
  },
  {
    path: 'game/:id',
    loadComponent: () => import('./game-detail/game-detail.page').then(m => m.GameDetailPage)
  },
  { 
    path: 'games-clone',
    loadComponent: () => import('./games-clone/games-clone.page').then( m => m.GamesClonePage)
  },
];

