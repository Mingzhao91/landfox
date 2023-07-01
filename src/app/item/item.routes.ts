import { Routes } from '@angular/router';

import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemListAdminComponent } from './components/item-list-admin/item-list-admin.component';

export const routes: Routes = [
  {
    path: '',
    component: ItemListComponent,
  },
  {
    path: 'list',
    component: ItemListAdminComponent,
  },
];
