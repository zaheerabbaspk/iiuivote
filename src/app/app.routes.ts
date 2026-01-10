import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'voting',
    loadComponent: () => import('./pages/voting/voting.page').then(m => m.VotingPage)
  },
  {
    path: 'results',
    loadComponent: () => import('./pages/results/results.page').then(m => m.ResultsPage)
  }
];

