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
      {
        path: 'users',
        loadChildren: () => import('../user/user.routes').then((m) => m.routes),
      },
      {
        path: 'cart',
        loadChildren: () => import('../cart/cart.routes').then((m) => m.routes),
      },
    ],
  },
];
