import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestsqlitePageRoutingModule } from './testsqlite-routing.module';

import { TestsqlitePage } from './testsqlite.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestsqlitePageRoutingModule
  ],
  declarations: [TestsqlitePage]
})
export class TestsqlitePageModule {}
