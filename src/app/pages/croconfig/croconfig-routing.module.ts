import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CroconfigPage } from './croconfig.page';

const routes: Routes = [
  {
    path: '',
    component: CroconfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CroconfigPageRoutingModule {}
