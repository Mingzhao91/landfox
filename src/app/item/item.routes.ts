import { Routes } from '@angular/router';

import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemListAdminComponent } from './components/item-list-admin/item-list-admin.component';
import { ItemFormComponent } from './components/item-form/item-form.component';
import { SingleItemComponent } from './components/single-item/single-item.component';
import { authGuard } from '../shared/services/auth.guard';

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
    canActivate: [authGuard],
  },
  {
    path: 'form/:id',
    component: ItemFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'single-item/:id',
    component: SingleItemComponent,
  },
];
