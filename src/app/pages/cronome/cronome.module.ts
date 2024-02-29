import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CronomePageRoutingModule } from './cronome-routing.module';

import { CronomePage } from './cronome.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CronomePageRoutingModule
  ],
  declarations: [CronomePage]
})
export class CronomePageModule {}
