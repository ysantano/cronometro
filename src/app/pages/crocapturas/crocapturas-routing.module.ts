import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrocapturasPage } from './crocapturas.page';

const routes: Routes = [
  {
    path: '',
    component: CrocapturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrocapturasPageRoutingModule {}
