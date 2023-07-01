import { Routes } from '@angular/router';

import { GroundZeroComponent } from './components/ground-zero.component';

export const routes: Routes = [
  {
    path: '',
    component: GroundZeroComponent,
    children: [
      {
        path: '',
        redirectTo: 'items',
        pathMatch: 'full',
      },
      {
        path: 'items',
        loadChildren: () => import('../item/item.routes').then((m) => m.routes),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('../category/category.routes').then((m) => m.routes),
      },
    ],
  },
];
