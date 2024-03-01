import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrointercepcionesPage } from './crointercepciones.page';

const routes: Routes = [
  {
    path: '',
    component: CrointercepcionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrointercepcionesPageRoutingModule {}
