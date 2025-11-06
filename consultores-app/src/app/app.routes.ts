import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/consultores',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.Login)
  },
  {
    path: 'consultores',
    loadComponent: () => import('./components/consultores-list/consultores-list').then(m => m.ConsultoresList),
    canActivate: [authGuard]
  },
  {
    path: 'consultores/novo',
    loadComponent: () => import('./components/consultor-form/consultor-form').then(m => m.ConsultorForm),
    canActivate: [authGuard]
  },
  {
    path: 'consultores/editar/:id',
    loadComponent: () => import('./components/consultor-form/consultor-form').then(m => m.ConsultorForm),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/consultores'
  }
];
