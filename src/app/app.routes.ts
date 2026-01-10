import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'voting',
    pathMatch: 'full',
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

