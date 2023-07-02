import { Routes } from '@angular/router';

import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemListAdminComponent } from './components/item-list-admin/item-list-admin.component';
import { ItemFormComponent } from './components/item-form/item-form.component';

export const routes: Routes = [
  {
    path: '',
    component: ItemListComponent,
  },
  {
    path: 'list',
    component: ItemListAdminComponent,
  },
  {
    path: 'form',
    component: ItemFormComponent,
  },
  {
    path: 'form/:id',
    component: ItemFormComponent,
  },
];
