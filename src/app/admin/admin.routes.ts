import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'gallery',
        pathMatch: 'full',
      },
      {
        path: 'gallery',
        loadComponent: () =>
          import('./components/gallery-admin/gallery-admin.component').then(
            (m) => m.GalleryAdminComponent
          ),
      },
      {
        path: 'hero',
        loadComponent: () =>
          import('./components/hero-admin/hero-admin.component').then(
            (m) => m.HeroAdminComponent
          ),
      },
      {
        path: 'contacts',
        loadComponent: () =>
          import('./components/contacts-admin/contacts-admin.component').then(
            (m) => m.ContactsAdminComponent
          ),
      },
    ],
  },
];
