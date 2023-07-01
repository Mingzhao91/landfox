import { Routes } from '@angular/router';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    component: CategoryListComponent,
  },
  {
    path: 'form',
    component: CategoryFormComponent,
  },
  {
    path: 'form/:id',
    component: CategoryFormComponent,
  },
];
