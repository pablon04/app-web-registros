import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/registros',
        pathMatch: 'full'
    },
    {
        path: 'registros',
        loadComponent: () => import('./components/humComponent/humComponent').then(m => m.default),
    },
];
