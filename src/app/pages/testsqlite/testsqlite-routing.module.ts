import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestsqlitePage } from './testsqlite.page';

const routes: Routes = [
  {
    path: '',
    component: TestsqlitePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestsqlitePageRoutingModule {}
