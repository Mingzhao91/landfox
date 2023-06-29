import { Routes } from '@angular/router';

import { GroundZeroComponent } from './components/ground-zero.component';

export const routes: Routes = [
  {
    path: '',
    component: GroundZeroComponent,
    children: [
      {
        path: 'categories',
        loadChildren: () =>
          import('../category/category.routes').then((m) => m.routes),
      },
    ],
  },
];
