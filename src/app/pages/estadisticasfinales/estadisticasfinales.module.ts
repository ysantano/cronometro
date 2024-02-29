import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstadisticasfinalesPageRoutingModule } from './estadisticasfinales-routing.module';

import { EstadisticasfinalesPage } from './estadisticasfinales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstadisticasfinalesPageRoutingModule
  ],
  declarations: [EstadisticasfinalesPage]
})
export class EstadisticasfinalesPageModule {}
