import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrocastigosPageRoutingModule } from './crocastigos-routing.module';

import { CrocastigosPage } from './crocastigos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrocastigosPageRoutingModule
  ],
  declarations: [CrocastigosPage]
})
export class CrocastigosPageModule {}
