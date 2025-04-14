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
  {
    path: 'banned-images',
    loadComponent: () => import('./banned-images/pages/banned-images-list/banned-images-list.component').then(m => m.BannedImagesListComponent),
  },
  {
    path: 'banned-images/add',
    loadComponent: () => import('./banned-images/pages/banned-images-detail/banned-images-detail.component').then(m => m.BannedImagesDetailComponent),
  },
  {
    path: 'banned-images/detail/:id',
    loadComponent: () => import('./banned-images/pages/banned-images-detail/banned-images-detail.component').then(m => m.BannedImagesDetailComponent),
  },
  {
    path: 'watched-users',
    loadComponent: () => import('./watched-users/pages/watched-users-list/watched-users-list.component').then(m => m.WatchedUsersListComponent),
  },
  {
    path: 'watched-users/add',
    loadComponent: () => import('./watched-users/pages/watched-users-detail/watched-users-detail.component').then(m => m.WatchedUsersDetailComponent),
  },
  {
    path: 'watched-users/detail/:id',
    loadComponent: () => import('./watched-users/pages/watched-users-detail/watched-users-detail.component').then(m => m.WatchedUsersDetailComponent),
  },
  {
    path: 'trusted-users',
    loadComponent: () => import('./trusted-users/pages/trusted-users-list/trusted-users-list.component').then(m => m.TrustedUsersListComponent),
  },
  {
    path: 'trusted-users/add',
    loadComponent: () => import('./trusted-users/pages/trusted-users-detail/trusted-users-detail.component').then(m => m.TrustedUsersDetailComponent),
  },
  {
    path: 'trusted-users/detail/:id',
    loadComponent: () => import('./trusted-users/pages/trusted-users-detail/trusted-users-detail.component').then(m => m.TrustedUsersDetailComponent),
  },
  {
    path: 'ignored-users',
    loadComponent: () => import('./ignored-users/pages/ignored-users-list/ignored-users-list.component').then(m => m.IgnoredUsersListComponent),
  },
  {
    path: 'ignored-users/add',
    loadComponent: () => import('./ignored-users/pages/ignored-users-detail/ignored-users-detail.component').then(m => m.IgnoredUsersDetailComponent),
  },
  {
    path: 'ignored-users/detail/:id',
    loadComponent: () => import('./ignored-users/pages/ignored-users-detail/ignored-users-detail.component').then(m => m.IgnoredUsersDetailComponent),
  },
  {
    path: 'qr-code-bans',
    loadComponent: () => import('./qr-code-bans/pages/qr-code-bans-list/qr-code-bans-list.component').then(m => m.QrCodeBansListComponent),
  },
  {
    path: 'qr-code-bans/add',
    loadComponent: () => import('./qr-code-bans/pages/qr-code-bans-detail/qr-code-bans-detail.component').then(m => m.QrCodeBansDetailComponent),
  },
  {
    path: 'qr-code-bans/detail/:id',
    loadComponent: () => import('./qr-code-bans/pages/qr-code-bans-detail/qr-code-bans-detail.component').then(m => m.QrCodeBansDetailComponent),
  },
  {
    path: 'auto-approval',
    loadComponent: () => import('./auto-approval/pages/auto-approval-list/auto-approval-list.component').then(m => m.AutoApprovalListComponent),
  },
  {
    path: 'auto-approval/add',
    loadComponent: () => import('./auto-approval/pages/auto-approval-detail/auto-approval-detail.component').then(m => m.AutoApprovalDetailComponent),
  },
  {
    path: 'auto-approval/detail/:id',
    loadComponent: () => import('./auto-approval/pages/auto-approval-detail/auto-approval-detail.component').then(m => m.AutoApprovalDetailComponent),
  },
  {
    path: 'banned-usernames',
    loadComponent: () => import('./banned-usernames/pages/banned-usernames-list/banned-usernames-list.component').then(m => m.BannedUsernamesListComponent),
  },
  {
    path: 'banned-usernames/add',
    loadComponent: () => import('./banned-usernames/pages/banned-usernames-detail/banned-usernames-detail.component').then(m => m.BannedUsernamesDetailComponent),
  },
  {
    path: 'banned-usernames/detail/:id',
    loadComponent: () => import('./banned-usernames/pages/banned-usernames-detail/banned-usernames-detail.component').then(m => m.BannedUsernamesDetailComponent),
  },
];
