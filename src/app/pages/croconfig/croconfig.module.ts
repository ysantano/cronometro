import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CroconfigPageRoutingModule } from './croconfig-routing.module';

import { CroconfigPage } from './croconfig.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CroconfigPageRoutingModule
  ],
  declarations: [CroconfigPage]
})
export class CroconfigPageModule {}
