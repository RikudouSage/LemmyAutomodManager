import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./root/pages/homepage/homepage.component').then(m => m.HomepageComponent),
  },
  {
    path: 'ban-regexes',
    loadComponent: () => import('./ban-regexes/pages/ban-regexes-list/ban-regexes-list.component').then(m => m.BanRegexesListComponent),
  },
  {
    path: 'ban-regexes/detail/:id',
    loadComponent: () => import('./ban-regexes/pages/ban-regexes-detail/ban-regexes-detail.component').then(m => m.BanRegexesDetailComponent),
  },
  {
    path: 'ban-regexes/add',
    loadComponent: () => import('./ban-regexes/pages/ban-regexes-detail/ban-regexes-detail.component').then(m => m.BanRegexesDetailComponent),
  },
  {
    path: 'banned-emails',
    loadComponent: () => import('./banned-emails/pages/banned-emails-list/banned-emails-list.component').then(m => m.BannedEmailsListComponent),
  },
  {
    path: 'banned-emails/add',
    loadComponent: () => import('./banned-emails/pages/banned-emails-detail/banned-emails-detail.component').then(m => m.BannedEmailsDetailComponent),
  },
  {
    path: 'banned-emails/detail/:id',
    loadComponent: () => import('./banned-emails/pages/banned-emails-detail/banned-emails-detail.component').then(m => m.BannedEmailsDetailComponent),
  },
  {
    path: 'private-message-bans',
    loadComponent: () => import('./private-message-bans/pages/private-message-bans-list/private-message-bans-list.component').then(m => m.PrivateMessageBansListComponent),
  },
  {
    path: 'private-message-bans/add',
    loadComponent: () => import('./private-message-bans/pages/private-message-bans-detail/private-message-bans-detail.component').then(m => m.PrivateMessageBansDetailComponent),
  },
  {
    path: 'private-message-bans/detail/:id',
    loadComponent: () => import('./private-message-bans/pages/private-message-bans-detail/private-message-bans-detail.component').then(m => m.PrivateMessageBansDetailComponent),
  },
];
