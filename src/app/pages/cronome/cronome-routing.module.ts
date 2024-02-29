import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CronomePage } from './cronome.page';

const routes: Routes = [
  {
    path: '',
    component: CronomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CronomePageRoutingModule {}
