import { Routes } from '@angular/router';

import { ItemListComponent } from './components/item-list/item-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: ItemListComponent,
  },
];
