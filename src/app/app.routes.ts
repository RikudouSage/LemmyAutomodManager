import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./root/pages/homepage/homepage.component').then(m => m.HomepageComponent),
  },
  {
    path: 'ban-regexes',
    loadComponent: () => import('./ban-regexes/pages/ban-regexes-list/ban-regexes-list.component').then(m => m.BanRegexesListComponent),
  }
];
