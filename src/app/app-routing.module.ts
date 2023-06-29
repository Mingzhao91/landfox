import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GroundZeroComponent } from './shared/components/ground-zero/ground-zero.component';

const routes: Routes = [
  {
    path: '',
    component: GroundZeroComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
