import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrotowchdownPage } from './crotowchdown.page';

const routes: Routes = [
  {
    path: '',
    component: CrotowchdownPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrotowchdownPageRoutingModule {}
